const db = require('../db');

const getOrder = db.prepare('SELECT * FROM orders WHERE id = ?');
const getWorker = db.prepare('SELECT * FROM workers WHERE telegram_id = ?');
const acceptOrder = db.prepare(
  "UPDATE orders SET status = 'diterima', worker_id = ?, accepted_at = datetime('now') WHERE id = ? AND status = 'menunggu'"
);
const completeOrder = db.prepare(
  "UPDATE orders SET status = 'selesai', completed_at = datetime('now') WHERE id = ? AND worker_id = ? AND status = 'diterima'"
);
const bumpWorkerCount = db.prepare(
  'UPDATE workers SET orders_completed_today = orders_completed_today + 1 WHERE id = ?'
);

const selesaiButton = (orderId) => ({
  reply_markup: { inline_keyboard: [[{ text: '✅ Tandai Selesai', callback_data: `selesai:${orderId}` }]] },
});

function terima(bot, fromId, chatId, orderId) {
  const worker = getWorker.get(fromId);
  if (!worker) {
    bot.sendMessage(chatId, 'Belum terdaftar sebagai pekerja. Pakai /daftar dulu.');
    return;
  }

  const result = acceptOrder.run(worker.id, orderId);
  if (result.changes === 0) {
    bot.sendMessage(chatId, `Orderan #${orderId} sudah diambil orang lain atau tidak ditemukan.`);
    return;
  }

  const order = getOrder.get(orderId);
  bot.sendMessage(chatId, `Orderan #${orderId} diterima.`, selesaiButton(orderId));
  // Pemesan dari web (bukan Telegram) tidak punya requester_telegram_id — statusnya
  // dipantau lewat polling halaman order, bukan notifikasi push.
  if (order.requester_telegram_id) {
    bot.sendMessage(order.requester_telegram_id, `${worker.name} menerima orderan #${orderId} kamu. Kontaknya:`);
    bot.sendContact(order.requester_telegram_id, worker.phone, worker.name);
  }
}

function selesai(bot, fromId, chatId, orderId) {
  const worker = getWorker.get(fromId);
  if (!worker) return;

  const result = completeOrder.run(orderId, worker.id);
  if (result.changes === 0) {
    bot.sendMessage(chatId, `Orderan #${orderId} bukan milikmu atau belum diterima.`);
    return;
  }

  bumpWorkerCount.run(worker.id);
  const order = getOrder.get(orderId);
  bot.sendMessage(chatId, `Orderan #${orderId} ditandai selesai. Pembayaran langsung antar kamu dan pemesan (tunai/QRIS pribadi).`);
  if (order.requester_telegram_id) {
    bot.sendMessage(order.requester_telegram_id, `Orderan #${orderId} sudah ditandai selesai oleh ${worker.name}.`);
  }
}

module.exports = { terima, selesai };
