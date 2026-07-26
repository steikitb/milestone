const db = require('../db');

const getWorker = db.prepare('SELECT * FROM workers WHERE telegram_id = ?');
const setActive = db.prepare(
  'UPDATE workers SET active = ?, last_active_at = datetime(\'now\') WHERE telegram_id = ?'
);
const setLocation = db.prepare(
  'UPDATE workers SET lat = ?, lng = ? WHERE telegram_id = ?'
);

function requireRegistered(bot, chatId, telegramId) {
  const worker = getWorker.get(telegramId);
  if (!worker) {
    bot.sendMessage(chatId, 'Belum terdaftar. Pakai /daftar dulu.');
    return null;
  }
  return worker;
}

function aktif(bot, msg) {
  const chatId = msg.chat.id;
  if (!requireRegistered(bot, chatId, msg.from.id)) return;

  setActive.run(1, msg.from.id);
  bot.sendMessage(chatId, 'Kirim lokasi kamu sekarang (share location bawaan Telegram) supaya bisa dicocokkan dengan orderan terdekat.', {
    reply_markup: {
      keyboard: [[{ text: 'Bagikan Lokasi', request_location: true }]],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  });
}

function nonaktif(bot, msg) {
  const chatId = msg.chat.id;
  if (!requireRegistered(bot, chatId, msg.from.id)) return;

  setActive.run(0, msg.from.id);
  bot.sendMessage(chatId, 'Status nonaktif. Tidak akan menerima siaran orderan.', {
    reply_markup: { remove_keyboard: true },
  });
}

function updateLocation(bot, msg) {
  const chatId = msg.chat.id;
  const worker = requireRegistered(bot, chatId, msg.from.id);
  if (!worker || !msg.location) return;

  setLocation.run(msg.location.latitude, msg.location.longitude, msg.from.id);
  bot.sendMessage(chatId, 'Lokasi tercatat. Siap menerima orderan.', {
    reply_markup: { remove_keyboard: true },
  });
}

module.exports = { aktif, nonaktif, updateLocation };
