// 搜索功能与分组隐藏
const searchBox = document.getElementById('searchBox');
const sections = Array.from(document.querySelectorAll('[data-section]'));
const favoritesGrid = document.getElementById('favoritesGrid');
const favoritesEmpty = document.getElementById('favoritesEmpty');
const sectionsContainer = document.getElementById('sectionsContainer');
const editToggle = document.getElementById('editToggle');

if (searchBox) {
  searchBox.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    
    // 每次搜索时重新获取所有导航项（包括动态添加的收藏项）
    const navItems = document.querySelectorAll('.nav-item');

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

// 点击波纹效果（使用事件委托以支持动态添加的元素）
document.addEventListener('click', function(e) {
  const navItem = e.target.closest('.nav-item');
  if (!navItem) return;
  
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

  navItem.style.position = 'relative';
  navItem.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});

// 图标映射系统 - 每个图标都有独特的图标和颜色
(function setIcons() {
  // 使用 favicon 的网站列表（这些网站使用 Google favicon API）
  const faviconSites = [
    /nusmods\.com/i,
    /outlook\.office\.com/i,
    /mcprint/i
  ];

  // 详细的 URL 匹配规则 - 每个都有独特的图标和颜色
  const urlPatterns = [
    // 入学前准备
    { pattern: /osa\.nus\.edu\.sg.*accommodation.*hostel/i, icon: { type: 'material', name: 'hotel', color: '#FF6B6B' } },
    { pattern: /uhms\.nus\.edu\.sg/i, icon: { type: 'material', name: 'apartment', color: '#4ECDC4' } },
    { pattern: /det/i, icon: { type: 'material', name: 'school', color: '#95E1D3' } },
    { pattern: /uhc.*medical/i, icon: { type: 'material', name: 'local_hospital', color: '#F38181' } },
    { pattern: /ica.*solar/i, icon: { type: 'material', name: 'card_membership', color: '#AA96DA' } },
    { pattern: /exchange\.nus.*owa/i, icon: { type: 'material', name: 'mail', color: '#FFD93D' } },
    
    // 学校系统
    { pattern: /atlassian.*canvas/i, icon: { type: 'simpleicon', name: 'atlassian', color: '#0052CC' } },
    { pattern: /canvas\.login|canvas\.nus/i, icon: { type: 'simpleicon', name: 'instructure', color: '#E63F2F' } },
    { pattern: /myedurec/i, icon: { type: 'material', name: 'account_circle', color: '#6C5CE7' } },
    
    // 选课
    { pattern: /coursereg.*schedule/i, icon: { type: 'material', name: 'schedule', color: '#00B894' } },
    { pattern: /coursereg.*resources/i, icon: { type: 'material', name: 'folder_open', color: '#FDCB6E' } },
    
    // 就业找工作
    { pattern: /nsws/i, icon: { type: 'material', name: 'work_outline', color: '#E17055' } },
    { pattern: /cfg/i, icon: { type: 'material', name: 'business_center', color: '#0984E3' } },
    { pattern: /symplicity|talent/i, icon: { type: 'material', name: 'people', color: '#A29BFE' } },
    
    // 校园生活
    { pattern: /friendlymail/i, icon: { type: 'material', name: 'alternate_email', color: '#00CEC9' } },
    { pattern: /nuslibraries/i, icon: { type: 'material', name: 'local_library', color: '#6C5CE7' } },
    { pattern: /linc.*pin/i, icon: { type: 'material', name: 'lock', color: '#FD79A8' } },
    { pattern: /map\.nus/i, icon: { type: 'material', name: 'map', color: '#00B894' } },
    { pattern: /lost.*found/i, icon: { type: 'material', name: 'find_in_page', color: '#FDCB6E' } },
    { pattern: /student-card.*replacement/i, icon: { type: 'material', name: 'badge', color: '#E17055' } },
    { pattern: /nvpn/i, icon: { type: 'material', name: 'vpn_lock', color: '#74B9FF' } },
    { pattern: /nuscoop/i, icon: { type: 'material', name: 'store', color: '#A29BFE' } },
    { pattern: /uci.*utown.*facilities/i, icon: { type: 'material', name: 'meeting_room', color: '#00CEC9' } },
    { pattern: /aces.*fbs/i, icon: { type: 'material', name: 'room', color: '#6C5CE7' } },
    { pattern: /reboks/i, icon: { type: 'material', name: 'sports_basketball', color: '#E17055' } },
    { pattern: /software.*student/i, icon: { type: 'material', name: 'apps', color: '#0984E3' } },
    
    // Wifi
    { pattern: /eguides/i, icon: { type: 'material', name: 'router', color: '#00B894' } },
    { pattern: /eduroam/i, icon: { type: 'material', name: 'signal_wifi_4_bar', color: '#74B9FF' } },
    { pattern: /libfaq.*wifi|联网/i, icon: { type: 'material', name: 'settings_ethernet', color: '#A29BFE' } }
  ];

  // data-name 匹配规则（作为备用）
  const namePatterns = [
    { pattern: /宿舍.*介绍/i, icon: { type: 'material', name: 'hotel', color: '#FF6B6B' } },
    { pattern: /宿舍.*申请/i, icon: { type: 'material', name: 'apartment', color: '#4ECDC4' } },
    { pattern: /DET/i, icon: { type: 'material', name: 'school', color: '#95E1D3' } },
    { pattern: /体检/i, icon: { type: 'material', name: 'local_hospital', color: '#F38181' } },
    { pattern: /IPA/i, icon: { type: 'material', name: 'card_membership', color: '#AA96DA' } },
    { pattern: /邮箱.*首次/i, icon: { type: 'material', name: 'mail', color: '#FFD93D' } },
    { pattern: /Canvas.*指导/i, icon: { type: 'simpleicon', name: 'atlassian', color: '#0052CC' } },
    { pattern: /Canvas.*登录/i, icon: { type: 'simpleicon', name: 'instructure', color: '#E63F2F' } },
    { pattern: /EduRec/i, icon: { type: 'material', name: 'account_circle', color: '#6C5CE7' } },
    { pattern: /选课.*时间/i, icon: { type: 'material', name: 'schedule', color: '#00B894' } },
    { pattern: /选课.*vacancy/i, icon: { type: 'material', name: 'folder_open', color: '#FDCB6E' } },
    { pattern: /勤工俭学/i, icon: { type: 'material', name: 'work_outline', color: '#E17055' } },
    { pattern: /就业.*指导/i, icon: { type: 'material', name: 'business_center', color: '#0984E3' } },
    { pattern: /Talent.*实习/i, icon: { type: 'material', name: 'people', color: '#A29BFE' } },
    { pattern: /Friendlymail/i, icon: { type: 'material', name: 'alternate_email', color: '#00CEC9' } },
    { pattern: /图书馆/i, icon: { type: 'material', name: 'local_library', color: '#6C5CE7' } },
    { pattern: /重置.*PIN/i, icon: { type: 'material', name: 'lock', color: '#FD79A8' } },
    { pattern: /地图/i, icon: { type: 'material', name: 'map', color: '#00B894' } },
    { pattern: /Lost.*Found/i, icon: { type: 'material', name: 'find_in_page', color: '#FDCB6E' } },
    { pattern: /学生卡/i, icon: { type: 'material', name: 'badge', color: '#E17055' } },
    { pattern: /VPN/i, icon: { type: 'material', name: 'vpn_lock', color: '#74B9FF' } },
    { pattern: /Co-op/i, icon: { type: 'material', name: 'store', color: '#A29BFE' } },
    { pattern: /Utown.*研讨室/i, icon: { type: 'material', name: 'meeting_room', color: '#00CEC9' } },
    { pattern: /图书馆.*研讨室/i, icon: { type: 'material', name: 'room', color: '#6C5CE7' } },
    { pattern: /体育馆/i, icon: { type: 'material', name: 'sports_basketball', color: '#E17055' } },
    { pattern: /软件/i, icon: { type: 'material', name: 'apps', color: '#0984E3' } },
    { pattern: /eGuides/i, icon: { type: 'material', name: 'router', color: '#00B894' } },
    { pattern: /eduroam/i, icon: { type: 'material', name: 'signal_wifi_4_bar', color: '#74B9FF' } },
    { pattern: /联网/i, icon: { type: 'material', name: 'settings_ethernet', color: '#A29BFE' } }
  ];

  function getIconForItem(item) {
    const href = item.getAttribute('href') || '';
    const dataName = (item.getAttribute('data-name') || '').toLowerCase();
    
    // 检查是否应该使用 favicon
    for (const pattern of faviconSites) {
      if (pattern.test(href)) {
        return { type: 'favicon', url: href };
      }
    }
    
    // 先尝试 URL 匹配
    for (const { pattern, icon } of urlPatterns) {
      if (pattern.test(href)) {
        return icon;
      }
    }
    
    // 再尝试 data-name 匹配
    for (const { pattern, icon } of namePatterns) {
      if (pattern.test(dataName)) {
        return icon;
      }
    }
    
    // 默认图标
    return { type: 'material', name: 'link', color: '#667eea' };
  }

  function createIconElement(iconConfig) {
    const iconContainer = document.createElement('div');
    iconContainer.style.display = 'flex';
    iconContainer.style.alignItems = 'center';
    iconContainer.style.justifyContent = 'center';
    iconContainer.style.width = '100%';
    iconContainer.style.height = '100%';
    
    if (iconConfig.type === 'favicon') {
      // 使用 Google favicon API（保持不变）
      try {
        const url = new URL(iconConfig.url);
        const img = document.createElement('img');
        img.src = 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(url.hostname) + '&sz=128';
        img.style.width = '80%';
        img.style.height = '80%';
        img.style.objectFit = 'contain';
        img.alt = url.hostname + ' favicon';
        iconContainer.appendChild(img);
      } catch (e) {
        const icon = document.createElement('i');
        icon.className = 'material-icons';
        icon.textContent = 'link';
        icon.style.fontSize = '36px';
        icon.style.color = iconConfig.color || '#667eea';
        iconContainer.appendChild(icon);
      }
    } else if (iconConfig.type === 'simpleicon') {
      // 使用 Simple Icons CDN（使用指定颜色）
      const img = document.createElement('img');
      const color = iconConfig.color || '#ffffff';
      // 将颜色转换为不带#的格式
      const colorHex = color.replace('#', '');
      img.src = `https://cdn.simpleicons.org/${iconConfig.name}/${colorHex}`;
      img.style.width = '70%';
      img.style.height = '70%';
      img.style.objectFit = 'contain';
      img.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))';
      iconContainer.appendChild(img);
    } else if (iconConfig.type === 'material') {
      // 使用 Material Icons（使用指定颜色）
      const icon = document.createElement('i');
      icon.className = 'material-icons';
      icon.textContent = iconConfig.name;
      icon.style.fontSize = '36px';
      icon.style.color = iconConfig.color || '#667eea';
      icon.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
      iconContainer.appendChild(icon);
    }
    
    return iconContainer;
  }

  function setIconForItem(item) {
    const iconContainer = item.querySelector('.nav-icon');
    if (!iconContainer) return;
    
    const iconConfig = getIconForItem(item);
    iconContainer.innerHTML = '';
    const iconElement = createIconElement(iconConfig);
    iconContainer.appendChild(iconElement);
  }

  // 为所有导航项设置图标
  document.querySelectorAll('.nav-item').forEach(setIconForItem);
  
  // 监听 DOM 变化，为新添加的项设置图标
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) {
          if (node.classList && node.classList.contains('nav-item')) {
            setIconForItem(node);
          }
          const items = node.querySelectorAll && node.querySelectorAll('.nav-item');
          if (items) {
            items.forEach(setIconForItem);
          }
        }
      });
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
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
    
    // 获取所有模块的顺序（考虑保存的顺序）
    const sectionOrder = (function() {
      try { return JSON.parse(localStorage.getItem('section_order') || '[]'); } catch { return []; }
    })();
    const itemOrderMap = (function() {
      try { return JSON.parse(localStorage.getItem('item_order') || '{}'); } catch { return {}; }
    })();
    
    // 收集所有收藏项，按保存的顺序
    const allFavItems = [];
    const sections = sectionOrder.length > 0 
      ? sectionOrder.map(id => document.querySelector(`[data-section-id="${id}"]`)).filter(Boolean)
      : Array.from(document.querySelectorAll('[data-section]'));
    
    sections.forEach(section => {
      const sectionId = section.getAttribute('data-section-id');
      const grid = section.querySelector('.nav-grid');
      if (!grid) return;
      
      const items = Array.from(grid.querySelectorAll('.nav-item'));
      const orderedHrefs = itemOrderMap[sectionId];
      
      // 如果有保存的顺序，按顺序排列；否则按 DOM 顺序
      const orderedItems = orderedHrefs && orderedHrefs.length > 0
        ? orderedHrefs.map(href => items.find(item => item.getAttribute('href') === href)).filter(Boolean)
        : items;
      
      orderedItems.forEach(item => {
        if (favs.has(item.getAttribute('href'))) {
          allFavItems.push(item);
        }
      });
    });
    
    // 渲染收藏项
    allFavItems.forEach(srcItem => {
        const clone = srcItem.cloneNode(true);
        // 移除可能存在的移动按钮（克隆时带过来的）
        const existingMoveBtns = clone.querySelector('.item-move-buttons');
        if (existingMoveBtns) existingMoveBtns.remove();
        
        const btn = clone.querySelector('.fav-btn');
        if (btn) btn.addEventListener('click', e => { e.preventDefault(); toggleFav(clone.getAttribute('href')); });
        favoritesGrid.appendChild(clone);
        
        // 如果处于编辑模式，为新添加的项创建移动按钮
        if (document.body.classList.contains('edit-mode')) {
          setTimeout(() => {
            const grid = favoritesGrid;
            const btnContainer = document.createElement('div');
            btnContainer.className = 'item-move-buttons';
            
            const upBtn = document.createElement('button');
            upBtn.className = 'move-btn move-up';
            upBtn.innerHTML = '<i class="material-icons">arrow_upward</i>';
            upBtn.title = '上移';
            upBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              e.preventDefault();
              const prev = clone.previousElementSibling;
              if (prev && prev.classList.contains('nav-item')) {
                grid.insertBefore(clone, prev);
                const sectionId = 'favorites';
                const hrefs = Array.from(grid.querySelectorAll('.nav-item')).map(item => item.getAttribute('href'));
                const orderMap = (function() {
                  try { return JSON.parse(localStorage.getItem('item_order') || '{}'); } catch { return {}; }
                })();
                orderMap[sectionId] = hrefs;
                localStorage.setItem('item_order', JSON.stringify(orderMap));
                // 更新按钮状态
                const items = Array.from(grid.querySelectorAll('.nav-item'));
                items.forEach((item, index) => {
                  const btnContainer = item.querySelector('.item-move-buttons');
                  if (!btnContainer) return;
                  const upBtn = btnContainer.querySelector('.move-up');
                  const downBtn = btnContainer.querySelector('.move-down');
                  if (upBtn) upBtn.disabled = index === 0;
                  if (downBtn) downBtn.disabled = index === items.length - 1;
                });
              }
            });
            
            const downBtn = document.createElement('button');
            downBtn.className = 'move-btn move-down';
            downBtn.innerHTML = '<i class="material-icons">arrow_downward</i>';
            downBtn.title = '下移';
            downBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              e.preventDefault();
              const next = clone.nextElementSibling;
              if (next && next.classList.contains('nav-item')) {
                grid.insertBefore(next, clone);
                const sectionId = 'favorites';
                const hrefs = Array.from(grid.querySelectorAll('.nav-item')).map(item => item.getAttribute('href'));
                const orderMap = (function() {
                  try { return JSON.parse(localStorage.getItem('item_order') || '{}'); } catch { return {}; }
                })();
                orderMap[sectionId] = hrefs;
                localStorage.setItem('item_order', JSON.stringify(orderMap));
                // 更新按钮状态
                const items = Array.from(grid.querySelectorAll('.nav-item'));
                items.forEach((item, index) => {
                  const btnContainer = item.querySelector('.item-move-buttons');
                  if (!btnContainer) return;
                  const upBtn = btnContainer.querySelector('.move-up');
                  const downBtn = btnContainer.querySelector('.move-down');
                  if (upBtn) upBtn.disabled = index === 0;
                  if (downBtn) downBtn.disabled = index === items.length - 1;
                });
              }
            });
            
            btnContainer.appendChild(upBtn);
            btnContainer.appendChild(downBtn);
            clone.appendChild(btnContainer);
            
            // 更新按钮状态
            const items = Array.from(grid.querySelectorAll('.nav-item'));
            const index = items.indexOf(clone);
            upBtn.disabled = index === 0;
            downBtn.disabled = index === items.length - 1;
          }, 0);
        }
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

// 布局编辑：使用上移/下移按钮调整顺序
(function layoutEditor(){
  if (!sectionsContainer) return;
  const root = document.body;
  const SECTION_ORDER_KEY = 'section_order';
  const SECTION_COLS_KEY = 'section_cols';
  const ITEM_ORDER_KEY = 'item_order';

  function getOrder(){
    try { return JSON.parse(localStorage.getItem(SECTION_ORDER_KEY) || '[]'); } catch { return []; }
  }
  function saveOrder(ids){ localStorage.setItem(SECTION_ORDER_KEY, JSON.stringify(ids)); }
  function getCols(){
    try { return JSON.parse(localStorage.getItem(SECTION_COLS_KEY) || '{}'); } catch { return {}; }
  }
  function saveCols(map){ localStorage.setItem(SECTION_COLS_KEY, JSON.stringify(map)); }
  function getItemOrder(){
    try { return JSON.parse(localStorage.getItem(ITEM_ORDER_KEY) || '{}'); } catch { return {}; }
  }
  function saveItemOrder(map){ localStorage.setItem(ITEM_ORDER_KEY, JSON.stringify(map)); }

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

  function applyItemOrder(){
    const orderMap = getItemOrder();
    document.querySelectorAll('[data-section]').forEach(section => {
      const sectionId = section.getAttribute('data-section-id');
      const grid = section.querySelector('.nav-grid');
      if (!grid || !sectionId) return;
      
      const hrefs = orderMap[sectionId];
      if (!hrefs || !Array.isArray(hrefs)) return;
      
      const items = Array.from(grid.querySelectorAll('.nav-item'));
      const itemMap = new Map();
      items.forEach(item => itemMap.set(item.getAttribute('href'), item));
      
      // 按保存的顺序重新排列
      hrefs.forEach(href => {
        const item = itemMap.get(href);
        if (item) grid.appendChild(item);
      });
    });
  }

  // 保存当前模块顺序
  function saveCurrentSectionOrder(){
    const ids = Array.from(sectionsContainer.querySelectorAll('[data-section]')).map(s => s.getAttribute('data-section-id'));
    saveOrder(ids);
  }

  // 保存当前图标顺序
  function saveCurrentItemOrder(sectionId){
    const section = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (!section) return;
    const grid = section.querySelector('.nav-grid');
    if (!grid) return;
    const hrefs = Array.from(grid.querySelectorAll('.nav-item')).map(item => item.getAttribute('href'));
    const orderMap = getItemOrder();
    orderMap[sectionId] = hrefs;
    saveItemOrder(orderMap);
  }

  // 模块上移
  function moveSectionUp(section){
    const prev = section.previousElementSibling;
    if (!prev || !prev.hasAttribute('data-section')) return;
    sectionsContainer.insertBefore(section, prev);
    saveCurrentSectionOrder();
    updateSectionButtons(); // 更新按钮状态
  }

  // 模块下移
  function moveSectionDown(section){
    const next = section.nextElementSibling;
    if (!next || !next.hasAttribute('data-section')) return;
    sectionsContainer.insertBefore(next, section);
    saveCurrentSectionOrder();
    updateSectionButtons(); // 更新按钮状态
  }

  // 图标上移
  function moveItemUp(item, grid){
    const prev = item.previousElementSibling;
    if (!prev || !prev.classList.contains('nav-item')) return;
    grid.insertBefore(item, prev);
    const section = grid.closest('[data-section]');
    const sectionId = section?.getAttribute('data-section-id');
    if (sectionId) {
      saveCurrentItemOrder(sectionId);
      updateItemButtons(grid); // 更新按钮状态
    }
  }

  // 图标下移
  function moveItemDown(item, grid){
    const next = item.nextElementSibling;
    if (!next || !next.classList.contains('nav-item')) return;
    grid.insertBefore(next, item);
    const section = grid.closest('[data-section]');
    const sectionId = section?.getAttribute('data-section-id');
    if (sectionId) {
      saveCurrentItemOrder(sectionId);
      updateItemButtons(grid); // 更新按钮状态
    }
  }

  // 创建模块控制按钮
  function createSectionButtons(section){
    const header = section.querySelector('.section-header');
    if (!header) return;
    
    // 检查是否已存在按钮
    if (header.querySelector('.section-move-buttons')) return;
    
    const btnContainer = document.createElement('div');
    btnContainer.className = 'section-move-buttons';
    
    const upBtn = document.createElement('button');
    upBtn.className = 'move-btn move-up';
    upBtn.innerHTML = '<i class="material-icons">arrow_upward</i>';
    upBtn.title = '上移';
    upBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      moveSectionUp(section);
    });
    
    const downBtn = document.createElement('button');
    downBtn.className = 'move-btn move-down';
    downBtn.innerHTML = '<i class="material-icons">arrow_downward</i>';
    downBtn.title = '下移';
    downBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      moveSectionDown(section);
    });
    
    btnContainer.appendChild(upBtn);
    btnContainer.appendChild(downBtn);
    header.appendChild(btnContainer);
  }

  // 创建图标控制按钮
  function createItemButtons(item){
    // 检查是否已存在按钮
    if (item.querySelector('.item-move-buttons')) return;
    
    const btnContainer = document.createElement('div');
    btnContainer.className = 'item-move-buttons';
    
    const upBtn = document.createElement('button');
    upBtn.className = 'move-btn move-up';
    upBtn.innerHTML = '<i class="material-icons">arrow_upward</i>';
    upBtn.title = '上移';
    upBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const grid = item.closest('.nav-grid');
      if (grid) moveItemUp(item, grid);
    });
    
    const downBtn = document.createElement('button');
    downBtn.className = 'move-btn move-down';
    downBtn.innerHTML = '<i class="material-icons">arrow_downward</i>';
    downBtn.title = '下移';
    downBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const grid = item.closest('.nav-grid');
      if (grid) moveItemDown(item, grid);
    });
    
    btnContainer.appendChild(upBtn);
    btnContainer.appendChild(downBtn);
    item.appendChild(btnContainer);
  }

  // 更新模块按钮状态（禁用第一个的上移和最后一个的下移）
  function updateSectionButtons(){
    const sections = Array.from(sectionsContainer.querySelectorAll('[data-section]'));
    sections.forEach((section, index) => {
      const btnContainer = section.querySelector('.section-move-buttons');
      if (!btnContainer) return;
      const upBtn = btnContainer.querySelector('.move-up');
      const downBtn = btnContainer.querySelector('.move-down');
      if (upBtn) upBtn.disabled = index === 0;
      if (downBtn) downBtn.disabled = index === sections.length - 1;
    });
  }

  // 更新图标按钮状态
  function updateItemButtons(grid){
    const items = Array.from(grid.querySelectorAll('.nav-item'));
    items.forEach((item, index) => {
      const btnContainer = item.querySelector('.item-move-buttons');
      if (!btnContainer) return;
      const upBtn = btnContainer.querySelector('.move-up');
      const downBtn = btnContainer.querySelector('.move-down');
      if (upBtn) upBtn.disabled = index === 0;
      if (downBtn) downBtn.disabled = index === items.length - 1;
    });
  }

  // 显示编辑按钮
  function showEditButtons(){
    document.querySelectorAll('[data-section]').forEach(createSectionButtons);
    document.querySelectorAll('.nav-item').forEach(createItemButtons);
    updateSectionButtons();
    document.querySelectorAll('.nav-grid').forEach(updateItemButtons);
    
    // 编辑模式下阻止点击跳转
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', function(e) {
        if (root.classList.contains('edit-mode')) {
          // 如果点击的是移动按钮，不阻止
          if (e.target.closest('.item-move-buttons')) return;
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);
    });
  }

  // 隐藏编辑按钮
  function hideEditButtons(){
    document.querySelectorAll('.section-move-buttons').forEach(btn => btn.remove());
    document.querySelectorAll('.item-move-buttons').forEach(btn => btn.remove());
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
      if (enabled) {
        showEditButtons();
      } else {
        hideEditButtons();
      }
      const span = editToggle.querySelector('span');
      if (span) span.textContent = enabled ? '完成编辑' : '编辑布局';
    });
  }

  // 监听动态添加的元素（如收藏项）
  const observer = new MutationObserver(function(mutations) {
    if (root.classList.contains('edit-mode')) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) {
            if (node.classList && node.classList.contains('nav-item')) {
              createItemButtons(node);
              const grid = node.closest('.nav-grid');
              if (grid) updateItemButtons(grid);
            }
            const items = node.querySelectorAll && node.querySelectorAll('.nav-item');
            if (items) {
              items.forEach(item => {
                createItemButtons(item);
                const grid = item.closest('.nav-grid');
                if (grid) updateItemButtons(grid);
              });
            }
            if (node.hasAttribute && node.hasAttribute('data-section')) {
              createSectionButtons(node);
              updateSectionButtons();
            }
          }
        });
      });
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });

  // 初次应用
  applyOrder();
  applyCols();
  applyItemOrder();
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


// 目录功能
(function tocFeature() {
  const tocToggle = document.getElementById('tocToggle');
  const tocPanel = document.getElementById('tocPanel');
  const tocList = document.getElementById('tocList');
  
  if (!tocToggle || !tocPanel || !tocList) return;
  
  // 生成目录列表
  function generateTOC() {
    const sections = document.querySelectorAll('[data-section]');
    tocList.innerHTML = '';
    
    sections.forEach(section => {
      const titleElement = section.querySelector('.section-title');
      if (!titleElement) return;
      
      const title = titleElement.textContent.trim();
      const item = document.createElement('div');
      item.className = 'toc-item';
      item.textContent = title;
      item.addEventListener('click', () => {
        scrollToSection(section);
        toggleTOC();
      });
      tocList.appendChild(item);
    });
  }
  
  // 滚动到指定模块
  function scrollToSection(section) {
    const headerOffset = 80;
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
  
  // 切换目录显示/隐藏
  function toggleTOC() {
    tocPanel.classList.toggle('active');
  }
  
  // 点击按钮切换目录
  tocToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    toggleTOC();
  });
  
  // 点击外部区域关闭目录
  document.addEventListener('click', function(e) {
    if (!tocPanel.contains(e.target) && e.target !== tocToggle) {
      tocPanel.classList.remove('active');
    }
  });
  
  // 初始生成目录
  generateTOC();
  
  // 监听 DOM 变化，更新目录（当模块顺序改变时）
  const observer = new MutationObserver(function() {
    generateTOC();
  });
  
  observer.observe(document.getElementById('sectionsContainer'), {
    childList: true,
    subtree: false
  });
})();


