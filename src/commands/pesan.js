const db = require('../db');
const { estimateDistanceKm } = require('../distance');

const MAX_RADIUS_KM = Number(process.env.MODULE_RADIUS_KM || 3);
const PRIORITAS_SEPI_WINDOW_MS = 8000; // README §"5 gagasan" — 8 detik pertama utk yang paling sepi

const MODULES = ['mijek', 'mibeli', 'miservis'];
const MODULE_LABELS = { mijek: '🛵 Mijek (antar/kurir)', mibeli: '🛍️ Mibeli (titip-beli)', miservis: '🔧 Miservis (jasa panggilan)' };

// draft pesanan: chatId -> { module } saat menunggu deskripsi diketik,
// lalu chatId -> { module, description } saat menunggu lokasi dibagikan.
const pendingModuleChoice = new Map();
const pendingDrafts = new Map();

const insertOrder = db.prepare(`
  INSERT INTO orders (requester_telegram_id, requester_name, module, description, lat, lng)
  VALUES (@requester_telegram_id, @requester_name, @module, @description, @lat, @lng)
`);
const getOrder = db.prepare('SELECT * FROM orders WHERE id = ?');
const activeWorkersWithLocation = db.prepare(
  'SELECT * FROM workers WHERE active = 1 AND lat IS NOT NULL AND lng IS NOT NULL'
);

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
// dalam radius. Lihat README §"5 gagasan" dan docs/03-arsitektur.md.
async function handleLocation(bot, msg) {
  const chatId = msg.chat.id;
  const draft = pendingDrafts.get(chatId);
  if (!draft || !msg.location) return;
  pendingDrafts.delete(chatId);

  const order = insertOrder.run({
    requester_telegram_id: msg.from.id,
    requester_name: `${msg.from.first_name || ''} ${msg.from.last_name || ''}`.trim(),
    module: draft.module,
    description: draft.description,
    lat: msg.location.latitude,
    lng: msg.location.longitude,
  });
  const orderId = order.lastInsertRowid;

  bot.sendMessage(chatId, `Orderan #${orderId} dibuat, mencari pekerja terdekat...`, {
    reply_markup: { remove_keyboard: true },
  });

  const candidates = activeWorkersWithLocation
    .all()
    .map((w) => ({ ...w, distanceKm: estimateDistanceKm(w.lat, w.lng, msg.location.latitude, msg.location.longitude) }))
    .filter((w) => w.distanceKm <= MAX_RADIUS_KM)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  if (candidates.length === 0) {
    bot.sendMessage(chatId, 'Belum ada pekerja aktif di sekitar sini. Coba lagi nanti.');
    return;
  }

  const minOrders = Math.min(...candidates.map((w) => w.orders_completed_today));
  const sepiTier = candidates.filter((w) => w.orders_completed_today === minOrders);
  const restTier = candidates.filter((w) => w.orders_completed_today !== minOrders);

  broadcastToWorkers(bot, orderId, draft, sepiTier);

  setTimeout(() => {
    const stillOpen = getOrder.get(orderId);
    if (stillOpen && stillOpen.status === 'menunggu' && restTier.length > 0) {
      broadcastToWorkers(bot, orderId, draft, restTier);
    }
  }, PRIORITAS_SEPI_WINDOW_MS);
}

function broadcastToWorkers(bot, orderId, draft, workers) {
  workers.forEach((w) => {
    bot.sendMessage(w.telegram_id, `📦 Orderan #${orderId} [${draft.module}]\n${draft.description}`, {
      reply_markup: { inline_keyboard: [[{ text: '✅ Terima', callback_data: `terima:${orderId}` }]] },
    });
  });
}

module.exports = { mulai, pilihModul, cobaSebagaiDeskripsi, handleLocation, MODULES };
