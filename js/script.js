// Escape helper
function esc(s){ return String(s || '').replace(/[&<>"']/g, function(m){
  return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]);
});}

document.addEventListener('DOMContentLoaded', function() {
  // year in footer
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = y;
  const yearProfile = document.getElementById('yearProfile');
  if (yearProfile) yearProfile.textContent = y;

  // Greeting name setup (uses sessionStorage)
  const namePlace = document.getElementById('namePlace');
  const setNameBtn = document.getElementById('setNameBtn');
  const visitorName = document.getElementById('visitorName');
  const saved = sessionStorage.getItem('visitorName');
  if (saved && namePlace) namePlace.textContent = saved;

  if (setNameBtn) {
    setNameBtn.addEventListener('click', function(){
      const v = visitorName.value.trim();
      if (!v) { alert('Masukkan nama terlebih dahulu'); return; }
      sessionStorage.setItem('visitorName', v);
      if (namePlace) namePlace.textContent = v;
    });
  }

  // Current time update (for result card)
  const timeEl = document.getElementById('currentTime');
  function updateTime(){
    if (!timeEl) return;
    const now = new Date();
    // format: YYYY-MM-DD HH:MM:SS (local)
    const pad = n => String(n).padStart(2,'0');
    const formatted = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    timeEl.textContent = formatted;
  }
  updateTime();
  // keep time ticking every second
  setInterval(updateTime, 1000);

  // Form handling
  const form = document.getElementById('contactForm');
  const resName = document.getElementById('resName');
  const resEmail = document.getElementById('resEmail');
  const resRole = document.getElementById('resRole');
  const resMessage = document.getElementById('resMessage');

  if (form) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const fullname = document.getElementById('fullname').value.trim();
      const email = document.getElementById('email').value.trim();
      const role = document.getElementById('role').value;
      const message = document.getElementById('message').value.trim();

      // simple validation
      if (!fullname) { alert('Nama wajib diisi'); return; }
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) { alert('Email tidak valid'); return; }
      if (!message) { alert('Pesan wajib diisi'); return; }

      // show in result card
      if (resName) resName.textContent = esc(fullname);
      if (resEmail) resEmail.textContent = esc(email);
      if (resRole) resRole.textContent = esc(role);
      if (resMessage) resMessage.textContent = esc(message);

      // update time immediately
      updateTime();

      // optional: save last submission to sessionStorage
      sessionStorage.setItem('lastSubmission', JSON.stringify({
        time: new Date().toISOString(),
        name: fullname,
        email: email,
        role: role,
        message: message
      }));

      // clear only message field (optional)
      // form.reset();
    });
  }

  // Clear button
  const clearBtn = document.getElementById('clearBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function(){
      if (!confirm('Clear form?')) return;
      form.reset();
      if (resName) resName.textContent = '-';
      if (resEmail) resEmail.textContent = '-';
      if (resRole) resRole.textContent = '-';
      if (resMessage) resMessage.textContent = '-';
    });
  }

  // restore last submission if exists
  const last = sessionStorage.getItem('lastSubmission');
  if (last) {
    try {
      const obj = JSON.parse(last);
      if (obj.name && resName) resName.textContent = esc(obj.name);
      if (obj.email && resEmail) resEmail.textContent = esc(obj.email);
      if (obj.role && resRole) resRole.textContent = esc(obj.role);
      if (obj.message && resMessage) resMessage.textContent = esc(obj.message);
    } catch(err){}
  }
});