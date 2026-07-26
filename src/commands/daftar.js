const db = require('../db');

const upsertWorker = db.prepare(`
  INSERT INTO workers (telegram_id, name, phone)
  VALUES (@telegram_id, @name, @phone)
  ON CONFLICT(telegram_id) DO UPDATE SET name = excluded.name, phone = excluded.phone
`);

// Verifikasi nomor pakai contact bawaan Telegram (request_contact) — tanpa OTP terpisah.
function register(bot, msg) {
  const chatId = msg.chat.id;
  const contact = msg.contact;

  if (!contact) {
    bot.sendMessage(chatId, 'Kirim nomor HP kamu lewat tombol "Bagikan Kontak" ya.', {
      reply_markup: {
        keyboard: [[{ text: 'Bagikan Kontak', request_contact: true }]],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    });
    return;
  }

  upsertWorker.run({
    telegram_id: msg.from.id,
    name: `${msg.from.first_name || ''} ${msg.from.last_name || ''}`.trim(),
    phone: contact.phone_number,
  });

  bot.sendMessage(
    chatId,
    'Terdaftar sebagai pekerja Milestone. Pakai /aktif untuk mulai menerima orderan, /nonaktif untuk berhenti.',
    { reply_markup: { remove_keyboard: true } }
  );
}

module.exports = { register };
