const db = require('../db');
const { estimateDistanceKm } = require('../distance');

const MAX_RADIUS_KM = Number(process.env.MODULE_RADIUS_KM || 3);
const PRIORITAS_SEPI_WINDOW_MS = 8000; // README §"5 gagasan" — 8 detik pertama utk yang paling sepi

const MODULES = ['mijek', 'mibeli', 'miservis'];
const MODULE_LABELS = { mijek: '🛵 Mijek (antar/kurir)', mibeli: '🛍️ Mibeli (titip-beli)', miservis: '🔧 Miservis (jasa panggilan)' };

// draft pesanan Telegram: chatId -> { module } saat menunggu deskripsi diketik,
// lalu chatId -> { module, description } saat menunggu lokasi dibagikan.
const pendingModuleChoice = new Map();
const pendingDrafts = new Map();

const insertOrder = db.prepare(`
  INSERT INTO orders (requester_telegram_id, requester_name, requester_phone, source, module, description, lat, lng)
  VALUES (@requester_telegram_id, @requester_name, @requester_phone, @source, @module, @description, @lat, @lng)
`);
const getOrder = db.prepare('SELECT * FROM orders WHERE id = ?');
const activeWorkersWithLocation = db.prepare(
  'SELECT * FROM workers WHERE active = 1 AND lat IS NOT NULL AND lng IS NOT NULL'
);
const pendingOrders = db.prepare("SELECT * FROM orders WHERE status = 'menunggu'");

// Hanya true saat benar-benar menunggu lokasi (bukan saat masih menunggu
// deskripsi diketik) — supaya location yang nyasar tetap jatuh ke updateLocation.
function hasPendingDraft(chatId) {
  return pendingDrafts.has(chatId);
}

function offerOrder(bot, telegramId, order) {
  bot.sendMessage(telegramId, `📦 Orderan #${order.id} [${order.module}]\n${order.description}`, {
    reply_markup: { inline_keyboard: [[{ text: '✅ Terima', callback_data: `terima:${order.id}` }]] },
  });
}

// Dipanggil tiap kali pekerja aktif/pindah lokasi — supaya orderan yang sudah
// menunggu SEBELUM pekerja ini aktif tetap ditawarkan, bukan terkubur diam-diam.
function tawarkanOrderTertunda(bot, worker) {
  if (worker.lat == null || worker.lng == null) return;
  pendingOrders
    .all()
    .filter((o) => estimateDistanceKm(worker.lat, worker.lng, o.lat, o.lng) <= MAX_RADIUS_KM)
    .forEach((o) => offerOrder(bot, worker.telegram_id, o));
}

function moduleKeyboard() {
  return {
    reply_markup: {
      inline_keyboard: MODULES.map((m) => [{ text: MODULE_LABELS[m], callback_data: `modul:${m}` }]),
    },
  };
}

function mulai(bot, msg, args) {
  const chatId = msg.chat.id;
  const module_ = (args[0] || '').toLowerCase();
  const description = args.slice(1).join(' ').trim();

  // Format lama /pesan <modul> <deskripsi> tetap didukung.
  if (MODULES.includes(module_) && description) {
    pendingDrafts.set(chatId, { module: module_, description });
    askLocation(bot, chatId);
    return;
  }

  bot.sendMessage(chatId, 'Mau pesan modul apa?', moduleKeyboard());
}

function pilihModul(bot, callbackQuery, module_) {
  const chatId = callbackQuery.message.chat.id;
  pendingModuleChoice.set(chatId, module_);
  bot.answerCallbackQuery(callbackQuery.id);
  bot.sendMessage(chatId, `${MODULE_LABELS[module_]} dipilih. Ketik deskripsi pesananmu (contoh: "beliin nasi padang di warung pak budi").`);
}

// Pesan teks biasa (bukan command) dipakai sebagai deskripsi kalau lagi menunggu.
function cobaSebagaiDeskripsi(bot, msg) {
  const chatId = msg.chat.id;
  const module_ = pendingModuleChoice.get(chatId);
  if (!module_ || !msg.text || msg.text.startsWith('/')) return false;

  pendingModuleChoice.delete(chatId);
  pendingDrafts.set(chatId, { module: module_, description: msg.text.trim() });
  askLocation(bot, chatId);
  return true;
}

function askLocation(bot, chatId) {
  bot.sendMessage(chatId, 'Kirim lokasi tujuan/lokasi kamu sekarang.', {
    reply_markup: {
      keyboard: [[{ text: 'Bagikan Lokasi', request_location: true }]],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  });
}

// Prioritas Sepi: 8 detik pertama hanya ditawarkan ke pekerja aktif dalam radius
// dengan orderan tersedikit hari ini. Baru setelah itu dibuka untuk semua yang aktif
// dalam radius. Dipakai bareng oleh alur Telegram (/pesan) dan web (POST /api/orders).
// Lihat README §"5 gagasan" dan docs/03-arsitektur.md.
function createOrderAndBroadcast(bot, params) {
  const order = insertOrder.run({
    requester_telegram_id: params.requester_telegram_id ?? 0, // 0 = pemesan dari web
    requester_name: params.requester_name,
    requester_phone: params.requester_phone ?? null,
    source: params.source || 'telegram',
    module: params.module,
    description: params.description,
    lat: params.lat,
    lng: params.lng,
  });
  const orderId = order.lastInsertRowid;

  const candidates = activeWorkersWithLocation
    .all()
    .map((w) => ({ ...w, distanceKm: estimateDistanceKm(w.lat, w.lng, params.lat, params.lng) }))
    .filter((w) => w.distanceKm <= MAX_RADIUS_KM)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  if (candidates.length === 0) {
    return { orderId, candidateCount: 0 };
  }

  const minOrders = Math.min(...candidates.map((w) => w.orders_completed_today));
  const sepiTier = candidates.filter((w) => w.orders_completed_today === minOrders);
  const restTier = candidates.filter((w) => w.orders_completed_today !== minOrders);
  const order_ = { id: orderId, module: params.module, description: params.description };

  sepiTier.forEach((w) => offerOrder(bot, w.telegram_id, order_));

  setTimeout(() => {
    const stillOpen = getOrder.get(orderId);
    if (stillOpen && stillOpen.status === 'menunggu' && restTier.length > 0) {
      restTier.forEach((w) => offerOrder(bot, w.telegram_id, order_));
    }
  }, PRIORITAS_SEPI_WINDOW_MS);

  return { orderId, candidateCount: candidates.length };
}

async function handleLocation(bot, msg) {
  const chatId = msg.chat.id;
  const draft = pendingDrafts.get(chatId);
  if (!draft || !msg.location) return;
  pendingDrafts.delete(chatId);

  const { orderId, candidateCount } = createOrderAndBroadcast(bot, {
    requester_telegram_id: msg.from.id,
    requester_name: `${msg.from.first_name || ''} ${msg.from.last_name || ''}`.trim(),
    source: 'telegram',
    module: draft.module,
    description: draft.description,
    lat: msg.location.latitude,
    lng: msg.location.longitude,
  });

  bot.sendMessage(chatId, `Orderan #${orderId} dibuat, mencari pekerja terdekat...`, {
    reply_markup: { remove_keyboard: true },
  });
  if (candidateCount === 0) {
    bot.sendMessage(chatId, 'Belum ada pekerja aktif di sekitar sini. Coba lagi nanti.');
  }
}

module.exports = {
  mulai,
  pilihModul,
  cobaSebagaiDeskripsi,
  handleLocation,
  hasPendingDraft,
  tawarkanOrderTertunda,
  createOrderAndBroadcast,
  MODULES,
  MODULE_LABELS,
};
