const params = new URLSearchParams(window.location.search);
const orderId = params.get('id');
const card = document.getElementById('order-card');

const STATUS_LABEL = {
  menunggu: 'Menunggu pekerja',
  diterima: 'Diterima, sedang dikerjakan',
  selesai: 'Selesai',
  batal: 'Dibatalkan',
};

function render(order) {
  const worker = order.worker
    ? `<p><strong>${order.worker.name}</strong>${order.worker.phone ? ` — <a href="tel:${order.worker.phone}">${order.worker.phone}</a>` : ''}</p>`
    : '<p class="hint">Belum ada pekerja yang menerima.</p>';

  card.innerHTML = `
    <span class="status-badge status-${order.status}">${STATUS_LABEL[order.status] || order.status}</span>
    <p><strong>Orderan #${order.id}</strong> — ${order.module}</p>
    <p>${order.description}</p>
    ${worker}
  `;
}

async function poll() {
  if (!orderId) {
    card.textContent = 'ID orderan tidak ada.';
    return;
  }
  try {
    const res = await fetch(`/api/orders/${orderId}`);
    if (!res.ok) {
      card.textContent = 'Orderan tidak ditemukan.';
      return;
    }
    const order = await res.json();
    render(order);
    if (order.status === 'menunggu' || order.status === 'diterima') {
      setTimeout(poll, 3000);
    }
  } catch {
    setTimeout(poll, 5000);
  }
}

poll();
