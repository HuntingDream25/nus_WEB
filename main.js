// 搜索功能与分组隐藏
const searchBox = document.getElementById('searchBox');
const navItems = document.querySelectorAll('.nav-item');
const sections = Array.from(document.querySelectorAll('[data-section]'));
const favoritesGrid = document.getElementById('favoritesGrid');
const favoritesEmpty = document.getElementById('favoritesEmpty');
const sectionsContainer = document.getElementById('sectionsContainer');
const editToggle = document.getElementById('editToggle');

if (searchBox) {
  searchBox.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();

    navItems.forEach(item => {
      const itemName = (item.getAttribute('data-name') || '').toLowerCase();
      const itemTitle = (item.querySelector('.nav-title')?.textContent || '').toLowerCase();
      const itemDescription = (item.querySelector('.nav-description')?.textContent || '').toLowerCase();

      if (itemName.includes(searchTerm) || itemTitle.includes(searchTerm) || itemDescription.includes(searchTerm)) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });

    sections.forEach(section => {
      const visible = Array.from(section.querySelectorAll('.nav-item')).some(i => !i.classList.contains('hidden'));
      section.classList.toggle('hidden', !visible && searchTerm.length > 0);
    });
  });
}

// 点击波纹效果
navItems.forEach(item => {
  item.addEventListener('click', function() {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.marginLeft = '-10px';
    ripple.style.marginTop = '-10px';

    this.style.position = 'relative';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// 加载 favicon
(function setFavicons() {
  document.querySelectorAll('.nav-item').forEach(function(item) {
    try {
      const url = new URL(item.href);
      const iconContainer = item.querySelector('.nav-icon');
      let img = iconContainer.querySelector('img');
      if (!img) {
        img = document.createElement('img');
        img.alt = url.hostname + ' favicon';
        iconContainer.innerHTML = '';
        iconContainer.appendChild(img);
      }
      const faviconUrl = 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(url.hostname) + '&sz=128';
      img.src = faviconUrl;
    } catch (e) {
      // ignore invalid URLs
    }
  });
})();

// 收藏功能
(function favoritesFeature(){
  if (!favoritesGrid) return;

  function getFavSet(){
    try { return new Set(JSON.parse(localStorage.getItem('fav_links') || '[]')); } catch { return new Set(); }
  }
  function saveFavSet(set){ localStorage.setItem('fav_links', JSON.stringify(Array.from(set))); }

  // 首次访问时预置默认收藏
  function seedDefaultFavsIfNeeded(){
    const seededKey = 'fav_seeded_v2';
    const defaultFavs = [
      'https://outlook.office.com/mail/inbox/id/AAQkAGQwMDM4NTM1LTcwYmEtNDFiNC1hZGE2LWVlNTZhZDA4ZDNmYwAQADieis8SzE0ysxpCNEJHg7g%3D?hl=zh_CN',
      'https://www.nus.edu.sg/canvas/login/',
      'https://myedurec.nus.edu.sg/psp/cs90prd/?cmd=login&languageCd=ENG&',
      'https://nusmods.com/modules'
    ];
    let favs = getFavSet();
    if (favs.size === 0 && !localStorage.getItem(seededKey)) {
      defaultFavs.forEach(u => favs.add(u));
      saveFavSet(favs);
      localStorage.setItem(seededKey, '1');
    }
  }

  function refreshFavBadges(){
    const favs = getFavSet();
    document.querySelectorAll('.nav-item').forEach(item => {
      const href = item.getAttribute('href');
      const btn = item.querySelector('.fav-btn');
      if (!btn) return;
      if (favs.has(href)) btn.classList.add('is-fav'); else btn.classList.remove('is-fav');
    });
  }

  function renderFavorites(){
    const favs = getFavSet();
    favoritesGrid.innerHTML = '';
    if (favs.size === 0) {
      favoritesEmpty.style.display = '';
      return;
    }
    favoritesEmpty.style.display = 'none';
    // 依据当前页面顺序渲染收藏
    const allItems = Array.from(document.querySelectorAll('.nav-item'));
    allItems
      .filter(item => favs.has(item.getAttribute('href')))
      .forEach(srcItem => {
        const clone = srcItem.cloneNode(true);
        // 克隆项里的收藏按钮也要可用
        const btn = clone.querySelector('.fav-btn');
        if (btn) btn.addEventListener('click', e => { e.preventDefault(); toggleFav(clone.getAttribute('href')); });
        favoritesGrid.appendChild(clone);
      });
  }

  function toggleFav(href){
    const favs = getFavSet();
    if (favs.has(href)) favs.delete(href); else favs.add(href);
    saveFavSet(favs);
    refreshFavBadges();
    renderFavorites();
  }

  // 绑定原始卡片上的收藏按钮
  document.querySelectorAll('.nav-item .fav-btn').forEach(btn => {
    const item = btn.closest('.nav-item');
    btn.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      const href = item.getAttribute('href');
      toggleFav(href);
    });
  });

  // 初始渲染
  seedDefaultFavsIfNeeded();
  refreshFavBadges();
  renderFavorites();
})();

// 布局编辑：分区拖拽 + 列数
(function layoutEditor(){
  if (!sectionsContainer) return;
  const root = document.body;
  const SECTION_ORDER_KEY = 'section_order';
  const SECTION_COLS_KEY = 'section_cols';

  function getOrder(){
    try { return JSON.parse(localStorage.getItem(SECTION_ORDER_KEY) || '[]'); } catch { return []; }
  }
  function saveOrder(ids){ localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(ids)); }
  function getCols(){
    try { return JSON.parse(localStorage.getItem(SECTION_COLS_KEY) || '{}'); } catch { return {}; }
  }
  function saveCols(map){ localStorage.setItem(SECTION_COLS_KEY, JSON.stringify(map)); }

  function applyCols(){
    const map = getCols();
    document.querySelectorAll('[data-section]').forEach(sec => {
      const grid = sec.querySelector('.nav-grid');
      const id = sec.getAttribute('data-section-id');
      if (!grid || !id) return;
      const cols = map[id] || 4;
      grid.style.gridTemplateColumns = `repeat(auto-fit, minmax(${Math.max(120, Math.floor(800/cols))}px, 1fr))`;
      const input = sec.querySelector('[data-cols-input]');
      if (input) input.value = cols;
    });
  }

  function applyOrder(){
    const ids = getOrder();
    if (ids.length === 0) return;
    const map = new Map();
    document.querySelectorAll('[data-section]').forEach(sec => map.set(sec.getAttribute('data-section-id'), sec));
    ids.forEach(id => { const n = map.get(id); if (n) sectionsContainer.appendChild(n); });
  }

  function enableDrag(){
    document.querySelectorAll('[data-section]').forEach(sec => {
      sec.setAttribute('draggable','true');
      sec.addEventListener('dragstart', e => { sec.classList.add('dragging'); e.dataTransfer.setData('text/plain', sec.getAttribute('data-section-id')||''); });
      sec.addEventListener('dragend', () => sec.classList.remove('dragging'));
    });
    sectionsContainer.addEventListener('dragover', e => {
      e.preventDefault();
      const dragging = document.querySelector('.dragging');
      if (!dragging) return;
      const after = Array.from(sectionsContainer.querySelectorAll('[data-section]:not(.dragging)'))
        .find(s => e.clientY <= s.getBoundingClientRect().top + s.offsetHeight/2);
      if (after) sectionsContainer.insertBefore(dragging, after); else sectionsContainer.appendChild(dragging);
    });
    sectionsContainer.addEventListener('drop', () => {
      const ids = Array.from(sectionsContainer.querySelectorAll('[data-section]')).map(s => s.getAttribute('data-section-id'));
      saveOrder(ids);
    });
  }

  function disableDrag(){
    document.querySelectorAll('[data-section]').forEach(sec => sec.removeAttribute('draggable'));
  }

  // 列数输入
  document.querySelectorAll('[data-cols-input]').forEach(input => {
    input.addEventListener('change', () => {
      const sec = input.closest('[data-section]');
      const id = sec?.getAttribute('data-section-id');
      if (!id) return;
      const map = getCols();
      const val = Math.max(1, Math.min(6, parseInt(input.value || '4', 10)));
      map[id] = val;
      saveCols(map);
      applyCols();
    });
  });

  // 编辑开关
  if (editToggle) {
    editToggle.addEventListener('click', () => {
      const enabled = !root.classList.contains('edit-mode');
      root.classList.toggle('edit-mode', enabled);
      if (enabled) enableDrag(); else disableDrag();
      editToggle.textContent = enabled ? '完成编辑' : '编辑布局';
    });
  }

  // 初次应用
  applyOrder();
  applyCols();
})();
// 登录助手：本地加密存储与复制
(function loginHelper() {
  const modal = document.getElementById('loginHelperModal');
  const openBtn = document.getElementById('loginHelperBtn');
  const closeBtn = document.getElementById('closeModal');
  const saveBtn = document.getElementById('saveCreds');
  const copyUserBtn = document.getElementById('copyUser');
  const copyPwdBtn = document.getElementById('copyPwd');
  const nusIdInput = document.getElementById('nusId');
  const nusPwdInput = document.getElementById('nusPwd');
  const passInput = document.getElementById('passphrase');

  if (!openBtn || !modal) return;

  function open() { modal.style.display = 'flex'; preload(); }
  function close() { modal.style.display = 'none'; }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', function(e){ if(e.target === modal) close(); });

  function preload(){
    const savedUser = localStorage.getItem('nus_user');
    if (savedUser) nusIdInput.value = savedUser;
  }

  async function deriveKey(passphrase, salt) {
    const enc = new TextEncoder();
    const baseKey = await crypto.subtle.importKey('raw', enc.encode(passphrase), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 150000, hash: 'SHA-256' },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async function encryptText(plainText, passphrase) {
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const key = await deriveKey(passphrase, salt);
    const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plainText));
    return { iv: Array.from(iv), salt: Array.from(salt), data: Array.from(new Uint8Array(cipher)) };
  }

  async function decryptText(payload, passphrase) {
    const { iv, salt, data } = payload;
    const key = await deriveKey(passphrase, new Uint8Array(salt));
    const plainBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(iv) }, key, new Uint8Array(data));
    return new TextDecoder().decode(plainBuf);
  }

  async function handleSave(){
    const user = nusIdInput.value.trim();
    const pwd = nusPwdInput.value;
    const pass = passInput.value;
    if (!user) { alert('请填写 NUS ID'); return; }
    localStorage.setItem('nus_user', user);
    if (pwd) {
      if (!pass) { alert('保存密码前需要设置密码短语'); return; }
      const enc = await encryptText(pwd, pass);
      localStorage.setItem('nus_pwd_enc', JSON.stringify(enc));
      alert('已保存用户名与加密后的密码');
      nusPwdInput.value = '';
    } else {
      alert('已保存用户名');
    }
  }

  async function copyUser(){
    const user = localStorage.getItem('nus_user') || '';
    if (!user) { alert('尚未保存用户名'); return; }
    await navigator.clipboard.writeText(user);
    alert('已复制用户名');
  }

  async function copyPwd(){
    const encStr = localStorage.getItem('nus_pwd_enc');
    if (!encStr) { alert('尚未保存密码'); return; }
    const pass = passInput.value;
    if (!pass) { alert('请输入密码短语以解密'); return; }
    try {
      const plain = await decryptText(JSON.parse(encStr), pass);
      await navigator.clipboard.writeText(plain);
      alert('已复制密码（请尽快粘贴）');
    } catch (e) {
      alert('解密失败：请检查密码短语是否正确');
    }
  }

  saveBtn.addEventListener('click', function(){ handleSave(); });
  copyUserBtn.addEventListener('click', function(){ copyUser(); });
  copyPwdBtn.addEventListener('click', function(){ copyPwd(); });
})();


// 反馈表单提交
// 反馈：使用 Google Forms 嵌入，无需 JS 提交逻辑


