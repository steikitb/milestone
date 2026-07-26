const state = { module: null, lat: null, lng: null };

const form = document.getElementById('order-form');
const modulePicker = document.getElementById('module-picker');
const btnLocation = document.getElementById('btn-location');
const locationStatus = document.getElementById('location-status');
const btnSubmit = document.getElementById('btn-submit');
const formError = document.getElementById('form-error');

function updateSubmitState() {
  btnSubmit.disabled = !(state.module && state.lat != null && state.lng != null);
}

fetch('/api/modules')
  .then((r) => r.json())
  .then((modules) => {
    modulePicker.innerHTML = '';
    modules.forEach(({ key, label }) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'module-option';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        state.module = key;
        [...modulePicker.children].forEach((c) => c.classList.remove('selected'));
        btn.classList.add('selected');
        updateSubmitState();
      });
      modulePicker.appendChild(btn);
    });
  });

btnLocation.addEventListener('click', () => {
  if (!navigator.geolocation) {
    locationStatus.textContent = 'Browser tidak mendukung geolokasi.';
    return;
  }
  locationStatus.textContent = 'Mengambil lokasi...';
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      state.lat = pos.coords.latitude;
      state.lng = pos.coords.longitude;
      locationStatus.textContent = `Lokasi didapat (akurasi ~${Math.round(pos.coords.accuracy)}m).`;
      updateSubmitState();
    },
    (err) => {
      locationStatus.textContent = `Gagal ambil lokasi: ${err.message}. Izinkan akses lokasi lalu coba lagi.`;
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  formError.textContent = '';
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Mengirim...';

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        module: state.module,
        description: document.getElementById('description').value,
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        lat: state.lat,
        lng: state.lng,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Gagal membuat orderan');
    }
    window.location.href = `/order.html?id=${data.id}`;
  } catch (err) {
    formError.textContent = err.message;
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Buat Orderan';
  }
});
