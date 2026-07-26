require('dotenv').config();
const { TelegramBot } = require('node-telegram-bot-api');

const { register } = require('./commands/daftar');
const { aktif, nonaktif, updateLocation } = require('./commands/status');
const { mulai, pilihModul, cobaSebagaiDeskripsi, handleLocation, hasPendingDraft } = require('./commands/pesan');
const { terima, selesai } = require('./commands/terima');

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('TELEGRAM_BOT_TOKEN belum diisi. Salin .env.example ke .env dulu.');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.on('polling_error', (err) => console.error('polling_error:', err.message));
bot.on('message', (msg) => console.log('pesan masuk:', msg.chat.id, JSON.stringify(msg.text || msg)));

bot.onText(/^\/start$/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `Selamat datang di Milestone.\n\n` + `Pekerja: /daftar lalu /aktif\n` + `Warga: /pesan (pilih modul lewat tombol)`
  );
});

bot.onText(/^\/daftar$/, (msg) => register(bot, msg));
bot.on('contact', (msg) => register(bot, msg));

bot.onText(/^\/aktif$/, (msg) => aktif(bot, msg));
bot.onText(/^\/nonaktif$/, (msg) => nonaktif(bot, msg));

bot.onText(/^\/pesan(?:\s+(.+))?$/, (msg, match) => {
  const args = (match[1] || '').split(/\s+/).filter(Boolean);
  mulai(bot, msg, args);
});

// Fallback lama, tetap didukung selain tombol.
bot.onText(/^\/terima_(\d+)$/, (msg, match) => terima(bot, msg.from.id, msg.chat.id, Number(match[1])));
bot.onText(/^\/selesai_(\d+)$/, (msg, match) => selesai(bot, msg.from.id, msg.chat.id, Number(match[1])));

// Satu event lokasi dipakai bergantian oleh alur /aktif (pekerja) dan /pesan
// (pemesan) — pilih salah satu berdasarkan draft mana yang sedang menunggu,
// supaya pemesan yang belum jadi pekerja tidak kena pesan "belum terdaftar".
bot.on('location', (msg) => {
  if (hasPendingDraft(msg.chat.id)) {
    handleLocation(bot, msg);
  } else {
    updateLocation(bot, msg);
  }
});

// Deskripsi pesanan diketik sebagai teks biasa setelah modul dipilih lewat tombol.
bot.on('message', (msg) => {
  if (msg.text && !msg.text.startsWith('/')) {
    cobaSebagaiDeskripsi(bot, msg);
  }
});

bot.on('callback_query', (query) => {
  const data = query.data || '';
  const chatId = query.message.chat.id;
  const fromId = query.from.id;

  const clearButton = () =>
    bot.editMessageReplyMarkup({ inline_keyboard: [] }, { chat_id: chatId, message_id: query.message.message_id }).catch(() => {});

  if (data.startsWith('modul:')) {
    pilihModul(bot, query, data.slice('modul:'.length));
    return;
  }
  if (data.startsWith('terima:')) {
    terima(bot, fromId, chatId, Number(data.slice('terima:'.length)));
    bot.answerCallbackQuery(query.id);
    clearButton();
    return;
  }
  if (data.startsWith('selesai:')) {
    selesai(bot, fromId, chatId, Number(data.slice('selesai:'.length)));
    bot.answerCallbackQuery(query.id);
    clearButton();
    return;
  }
  bot.answerCallbackQuery(query.id);
});

console.log('Milestone bot Fase 0 jalan (polling).');
