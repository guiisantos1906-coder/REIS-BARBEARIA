document.addEventListener('DOMContentLoaded', () => {
  const banner = document.createElement('div');
  banner.className = 'offline-banner';
  banner.setAttribute('role', 'status');
  banner.textContent = 'Você está offline. Conecte-se para consultar e confirmar horários.';
  document.body.append(banner);
  const connection = () => { banner.hidden = navigator.onLine; };
  window.addEventListener('online', connection);
  window.addEventListener('offline', connection);
  connection();
  const menu = document.getElementById('menuToggle');
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      menu.click(); menu.focus();
    }
  });
  const nav = document.getElementById('nav');
  new MutationObserver(() => {
    menu.setAttribute('aria-label', nav.classList.contains('open') ? 'Fechar menu' : 'Abrir menu');
  }).observe(nav, { attributes: true, attributeFilter: ['class'] });
});
