const db = require('../db');
const { estimateDistanceKm } = require('../distance');

const MAX_RADIUS_KM = Number(process.env.MODULE_RADIUS_KM || 3);
const PRIORITAS_SEPI_WINDOW_MS = 8000; // README §"5 gagasan" — 8 detik pertama utk yang paling sepi

const MODULES = ['mijek', 'mibeli', 'miservis'];

// draft pesanan menunggu lokasi: chatId -> { module, description }
const pendingDrafts = new Map();

const insertOrder = db.prepare(`
  INSERT INTO orders (requester_telegram_id, requester_name, module, description, lat, lng)
  VALUES (@requester_telegram_id, @requester_name, @module, @description, @lat, @lng)
`);
const getOrder = db.prepare('SELECT * FROM orders WHERE id = ?');
const setBroadcastIds = db.prepare('UPDATE orders SET broadcast_message_ids = ? WHERE id = ?');
const activeWorkersWithLocation = db.prepare(
  'SELECT * FROM workers WHERE active = 1 AND lat IS NOT NULL AND lng IS NOT NULL'
);

function mulai(bot, msg, args) {
  const chatId = msg.chat.id;
  const module_ = (args[0] || '').toLowerCase();
  const description = args.slice(1).join(' ').trim();

  if (!MODULES.includes(module_)) {
    bot.sendMessage(chatId, `Format: /pesan <modul> <deskripsi>\nModul: ${MODULES.join(', ')}`);
    return;
  }
  if (!description) {
    bot.sendMessage(chatId, 'Sertakan deskripsi singkat, misal: /pesan mibeli beliin nasi padang di warung pak budi');
    return;
  }

  pendingDrafts.set(chatId, { module: module_, description });
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

  bot.sendMessage(chatId, `Orderan #${orderId} dibuat, mencari pekerja terdekat...`);

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
    bot.sendMessage(
      w.telegram_id,
      `📦 Orderan #${orderId} [${draft.module}]\n${draft.description}\n\nBalas /terima_${orderId} untuk ambil.`
    );
  });
}

module.exports = { mulai, handleLocation, MODULES };
