const path = require('path');
const Fastify = require('fastify');
const fastifyStatic = require('@fastify/static');

const db = require('../db');
const { createOrderAndBroadcast, MODULES, MODULE_LABELS } = require('../commands/pesan');

const getOrderWithWorker = db.prepare(`
  SELECT o.id, o.module, o.description, o.status, o.created_at, o.accepted_at, o.completed_at,
         w.name AS worker_name, w.phone AS worker_phone
  FROM orders o
  LEFT JOIN workers w ON w.id = o.worker_id
  WHERE o.id = ?
`);

function buildServer(bot) {
  const app = Fastify({ logger: false });

  app.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
  });

  app.get('/api/modules', async () => MODULES.map((key) => ({ key, label: MODULE_LABELS[key] })));

  app.post('/api/orders', async (req, reply) => {
    const { module: moduleName, description, name, phone, lat, lng } = req.body || {};

    if (!MODULES.includes(moduleName)) {
      reply.code(400);
      return { error: 'Modul tidak valid' };
    }
    if (!description || !String(description).trim()) {
      reply.code(400);
      return { error: 'Deskripsi wajib diisi' };
    }
    if (!name || !String(name).trim()) {
      reply.code(400);
      return { error: 'Nama wajib diisi' };
    }
    if (typeof lat !== 'number' || typeof lng !== 'number') {
      reply.code(400);
      return { error: 'Lokasi wajib dikirim (aktifkan izin lokasi browser)' };
    }

    const { orderId, candidateCount } = createOrderAndBroadcast(bot, {
      requester_name: String(name).trim(),
      requester_phone: phone ? String(phone).trim() : null,
      source: 'web',
      module: moduleName,
      description: String(description).trim(),
      lat,
      lng,
    });

    reply.code(201);
    return { id: orderId, candidateCount };
  });

  app.get('/api/orders/:id', async (req, reply) => {
    const order = getOrderWithWorker.get(req.params.id);
    if (!order) {
      reply.code(404);
      return { error: 'Orderan tidak ditemukan' };
    }
    return {
      id: order.id,
      module: order.module,
      description: order.description,
      status: order.status,
      created_at: order.created_at,
      accepted_at: order.accepted_at,
      completed_at: order.completed_at,
      worker: order.worker_name ? { name: order.worker_name, phone: order.worker_phone } : null,
    };
  });

  return app;
}

module.exports = { buildServer };
