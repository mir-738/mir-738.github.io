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
const musicPlayer = document.getElementById('musicPlayer');
const musicSource = document.getElementById('musicSource');
const musicToggle = document.getElementById('musicToggle');
const musicDisc = document.getElementById('musicDisc');
const backToTop = document.getElementById('backToTop');

const musicTrack = './nusic.mp3';

function sortArticlesByDateDesc(list) {
    return [...list].sort((a, b) => {
        const dateA = new Date(a.create_time).getTime();
        const dateB = new Date(b.create_time).getTime();
        return dateB - dateA;
    });
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderContentBlock(block) {
    const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length === 0) return '';

    const firstLine = lines[0];

    const imageMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/);
    if (imageMatch) {
        const alt = escapeHtml(imageMatch[1]);
        const src = escapeHtml(imageMatch[2]);
        return `<p class="article-image"><img src="${src}" alt="${alt}" loading="lazy"></p>`;
    }

    if (firstLine.startsWith('###')) {
        const heading = escapeHtml(firstLine.replace(/^###\s*/, ''));
        const rest = lines.slice(1).join(' ');
        return rest
            ? `<h3>${heading}</h3><p>${escapeHtml(rest).replace(/\n/g, '<br>')}</p>`
            : `<h3>${heading}</h3>`;
    }

    if (lines.every(line => line.startsWith('-'))) {
        const items = lines
            .map(line => `<li>${escapeHtml(line.replace(/^-\s*/, ''))}</li>`)
            .join('');
        return `<ul>${items}</ul>`;
    }

    if (lines.every(line => line.startsWith('>'))) {
        const quote = lines
            .map(line => escapeHtml(line.replace(/^>\s*/, '')))
            .join('<br>');
        return `<blockquote>${quote}</blockquote>`;
    }

    return `<p>${escapeHtml(block).replace(/\n/g, '<br>')}</p>`;
}

function formatContent(text) {
    if (!text) return '';
    return text
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(Boolean)
        .map(renderContentBlock)
        .join('');
}

function randomPick(arr) {
    if (!arr || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
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

function getRandomArticleImage() {
    return randomPick(articleImages);
}

function renderArticleList() {
    const sortedArticles = sortArticlesByDateDesc(articles);
    articleList.innerHTML = sortedArticles.map(article => `
        <article class="article-card" data-id="${article.id}">
            <div class="card-header">
                <div class="card-title">${article.title}</div>
                <div class="card-date">${article.create_time}</div>
            </div>
            <hr class="card-divider">
            <div class="card-summary">${article.summary || '（暂无摘要）'}</div>
        </article>
    `).join('');

    document.querySelectorAll('.article-card').forEach(card => {
        card.addEventListener('click', () => showDetail(Number(card.dataset.id)));
    });
}

function showDetail(id) {
    const article = articles.find(a => a.id === id);
    if (!article) return;

    const bg = randomPick(backgroundImages);
    if (bg) setBackground(bg);

    const img = getRandomArticleImage();
    detailImage.innerHTML = img ? `<img src="${img}" alt="${article.title}">` : '';

    detailTitle.textContent = article.title;
    detailMeta.textContent = `发布时间：${article.create_time} | ${article.category}`;
    detailContent.innerHTML = formatContent(article.content);

    homeView.style.display = 'none';
    detailView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() {
    clearBackground();
    detailView.style.display = 'none';
    homeView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateTime() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('currentTime').textContent = `${h}:${m}:${s}`;

    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months[now.getMonth()];
    const day = String(now.getDate()).padStart(2, '0');
    const year = String(now.getFullYear());
    const weekday = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][now.getDay()];

    document.getElementById('currentMonth').textContent = month;
    document.getElementById('currentDay').textContent = day;
    document.getElementById('currentYear').textContent = `${year} ${weekday}`;
}

function updateBackToTopVisibility() {
    if (!backToTop) return;
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
}

function initMusic() {
    if (musicTrack && musicSource && musicPlayer) {
        musicSource.src = musicTrack;
        musicPlayer.load();
        musicPlayer.play().then(() => {
            musicDisc?.classList.add('playing');
        }).catch(() => {
            // 浏览器阻止自动播放时，等待用户首次交互。
        });
    }
}

function enableMusicOnFirstGesture() {
    const startMusic = () => {
        if (musicTrack && musicPlayer) {
            musicPlayer.play().then(() => {
                musicDisc?.classList.add('playing');
            }).catch(() => {});
        }
        window.removeEventListener('pointerdown', startMusic);
        window.removeEventListener('keydown', startMusic);
    };

    window.addEventListener('pointerdown', startMusic, { once: true });
    window.addEventListener('keydown', startMusic, { once: true });
}

function toggleMusic() {
    if (!musicTrack || !musicPlayer) return;
    if (musicPlayer.paused) {
        musicPlayer.play().then(() => {
            musicDisc?.classList.add('playing');
        }).catch(() => {});
    } else {
        musicPlayer.pause();
        musicDisc?.classList.remove('playing');
    }
}

musicPlayer?.addEventListener('play', () => musicDisc?.classList.add('playing'));
musicPlayer?.addEventListener('pause', () => musicDisc?.classList.remove('playing'));
musicToggle?.addEventListener('click', toggleMusic);
backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

renderArticleList();
updateTime();
setInterval(updateTime, 1000);
initMusic();
enableMusicOnFirstGesture();
updateBackToTopVisibility();

backBtn?.addEventListener('click', goHome);
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    goHome();
});

window.addEventListener('scroll', updateBackToTopVisibility, { passive: true });

goHome();
