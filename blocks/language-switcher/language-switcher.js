const LANGUAGE_CONFIG = {
  CSV_PATH: '/language-map.csv',
  COOKIE_NAME: 'preferred_lang',
  FALLBACK: 'en'
};

export default async function decorate(block) {
  const resp = await fetch(LANGUAGE_CONFIG.CSV_PATH);
  if (!resp.ok) return;
  
  const langMap = {};
  const text = await resp.text();
  const rows = text.split('\n').slice(1);
  
  rows.forEach(row => {
    const [path, en, es, fr] = row.split(',');
    langMap[path] = { en, es, fr };
  });

  const currentPath = window.location.pathname;
  const langLinks = document.createElement('div');
  langLinks.className = 'lang-switcher';
  
  langLinks.innerHTML = `
    <button data-lang="en">English</button>
    <button data-lang="es">Español</button>
    <button data-lang="fr">Français</button>
  `;

  langLinks.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.cookie = `${LANGUAGE_CONFIG.COOKIE_NAME}=${btn.dataset.lang};path=/;max-age=31536000`;
      window.location.href = langMap[currentPath]?.[btn.dataset.lang] || '/';
    });
  });

  block.appendChild(langLinks);
}