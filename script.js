// DOM 引用
const homeView = document.getElementById('homeView');
const detailView = document.getElementById('detailView');
const articleList = document.getElementById('articleList');
const detailTitle = document.getElementById('detailTitle');
const detailImage = document.getElementById('detailImage');
const detailMeta = document.getElementById('detailMeta');
const detailContent = document.getElementById('detailContent');
const backBtn = document.getElementById('backBtn');
const homeLink = document.getElementById('homeLink');
const bgBlur = document.getElementById('bg-blur');

// ===== 文本自动转 HTML =====
function formatContent(text) {
    if (!text) return '';
    let paragraphs = text.split(/\n\s*\n/);
    if (paragraphs.length === 1) {
        paragraphs = text.split(/\n/);
    }
    return paragraphs
        .filter(p => p.trim().length > 0)
        .map(p => `<p>${p.trim()}</p>`)
        .join('');
}

// ===== 工具：从数组随机取一项 =====
function randomPick(arr) {
    if (!arr || arr.length === 0) return null;
    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
}

// ===== 🆕 背景虚化层管理 =====
function getRandomBg() {
    return randomPick(backgroundImages);
}
function setBackground(imageUrl) {
    if (!imageUrl) {
        bgBlur.style.backgroundImage = '';
        bgBlur.classList.remove('show');
        return;
    }
    bgBlur.style.backgroundImage = `url(${imageUrl})`;
    bgBlur.classList.add('show');
}
function clearBackground() {
    bgBlur.style.backgroundImage = '';
    bgBlur.classList.remove('show');
}

// ===== 获取随机配图 =====
function getRandomArticleImage() {
    return randomPick(articleImages);
}

// ===== 渲染卡片列表 =====
function renderArticleList() {
    articleList.innerHTML = articles.map(article => `
        <div class="article-card" data-id="${article.id}">
            <div class="card-header">
                <div class="card-title">${article.title}</div>
                <div class="card-date">${article.create_time}</div>
            </div>
            <hr class="card-divider">
            <div class="card-summary">${article.summary || '（暂无题记）'}</div>
        </div>
    `).join('');

    document.querySelectorAll('.article-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            showDetail(id);
        });
    });
}

// ===== 显示详情 =====
function showDetail(id) {
    const article = articles.find(a => a.id === id);
    if (!article) return;

    // 随机背景（虚化层）
    const bg = getRandomBg();
    if (bg) setBackground(bg);

    // 随机配图
    const img = getRandomArticleImage();
    if (img) {
        detailImage.innerHTML = `<img src="${img}" alt="${article.title}">`;
    } else {
        detailImage.innerHTML = '';
    }

    detailTitle.textContent = article.title;
    detailMeta.textContent = `发布时间：${article.create_time}  |  分类：${article.category}`;
    detailContent.innerHTML = formatContent(article.content);

    homeView.style.display = 'none';
    detailView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== 返回首页 =====
function goHome() {
    clearBackground();
    detailView.style.display = 'none';
    homeView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== 时钟更新 =====
function updateTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('currentTime').textContent = h + ':' + m + ':' + s;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const day = now.getDate();
    const year = String(now.getFullYear()).slice(-2);
    document.getElementById('currentDate').textContent = month + '.' + day + ' ' + year;
}

// ===== 初始化 =====
renderArticleList();
updateTime();
setInterval(updateTime, 1000);

backBtn.addEventListener('click', goHome);
homeLink.addEventListener('click', function(e) {
    e.preventDefault();
    goHome();
});

goHome();