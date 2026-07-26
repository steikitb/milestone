require('dotenv').config();
const { TelegramBot } = require('node-telegram-bot-api');

const { register } = require('./commands/daftar');
const { aktif, nonaktif, updateLocation } = require('./commands/status');
const { mulai, handleLocation, MODULES } = require('./commands/pesan');
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
    `Selamat datang di Milestone.\n\n` +
      `Pekerja: /daftar lalu /aktif\n` +
      `Warga: /pesan <modul> <deskripsi> (modul: ${MODULES.join(', ')})`
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

bot.onText(/^\/terima_(\d+)$/, (msg, match) => terima(bot, msg, Number(match[1])));
bot.onText(/^\/selesai_(\d+)$/, (msg, match) => selesai(bot, msg, Number(match[1])));

// Satu handler lokasi dipakai bergantian oleh alur /aktif dan /pesan.
bot.on('location', (msg) => {
  updateLocation(bot, msg);
  handleLocation(bot, msg);
});

console.log('Milestone bot Fase 0 jalan (polling).');
