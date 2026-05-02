// CyberPulse Core Logic - Virtual Backend & SPA Auth

const APP_STATE = {
    user: null,
    cart: [],
    ownedGames: [],
    allGames: [
        { id: 1, title: "NEON SOULS", price: 59.99, tags: ["RPG", "OPEN WORLD"], image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBORZpQjG1_fs-YuqsiDPnVRWlE9JWl6JdTxkFynUGv7NNGXU5AT167QkaW_QBNnzm8RZNnFZpxQtTYI1s8zIM3bt9A5xaDpG0HxCe5MzECVOSHB6n6tYbdcKCl2wakiuFDGUmS5EGHmb9v6ToD6pzAozkDks4S51Xrp9kEvpVn6OrKolWdxlbuAJJojIz_f81pUJsHXGcUWzuK154RVngToqkKXeF2JX2nWlaOSHPafA3GE6tQ91CfGQCcCp_amAV2xMM9__3pTsqZ" },
        { id: 2, title: "VOID RACER", price: 0.00, tags: ["SIMULATOR"], image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHGJUtIS2Ev7EoTd1x6WstcYokCFc29Nv85EUckVpaRjwPk-Ucn2GYpy2dPrXcGu9a-Mnmad_cfw9tuMvouqMSRXOB3t3JxDPCpMEhz1Q53r-XMW4XTgAnbS0JPZFiEEAW_g334Gfeot91vXUgD4FdvDBN1sBfo7JiVHYuNAd2awjG5h2LlC6S_9IVhGtJCASZmbMPyfnGn-0pSjUbtGxFEJ-OPwZqKGVqc7xG0H5jfumoyau4HDn2EP5A8HoFibuKfGG0T-5PxKyV" },
        { id: 3, title: "GHOST OPS", price: 29.99, tags: ["FPS", "TACTICAL"], image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBT0ijPBRfAK7dv16qyR5FqiJuxMWLyXttLIFSKa8dZshNb9uIOvVjGAbWR-kYxU9A50hnPViuF3Wn0gvV500m68hiUF3azoqyZyVsLqtxuW7AP4TC1BDjYV4JW8T5UmGF99N8D9H1faSBp_HNBbwpFdU5tLXW4k091gJNeKc6PS3kjCIvvuba1MiG_KnqG4Z1IHpq8MGfo6qHorGXhOZFckr1XjhwgDqrn2PP01cUZdt_LMr09wbNqA2u-2DxlYS97ZDXJ4987ctN" },
        { id: 4, title: "SYNTH GRID", price: 14.99, tags: ["VR", "PUZZLE"], image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlP4Fw_smFY7V1hOj95THvxDGXi_nRKtVMnUFmKWsyf9WuIMH0qvcXBpTAPt1PyThXCNu71Px0UxNdmJDuc9BLvwWtEtHvJshBzJtx3hCiCzyTkI0VddnOmsdljMlI-8dazFSW2wvLAycQZPofeFYsp8rT8mE3S5MGHioWTt3tOz8MBYuVnlRoF32u_C49lb358UN5BuTQFVq5FHQPzhiXvtXah3qPq9tXUsEDRzSMBOPCnpyxmp_HTDhbdkp65QYmNYMc06gjqoZN" },
        { id: 5, title: "AETHER REALM", price: 39.99, tags: ["STRATEGY"], image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAplxl6YreWxesRmv8AIYHoq5R8lOl0IGi54TmrzDBEULAoCAQIuE9x-p8wBS4ahYI_a37fzoD2fnFlU7SZ1kF38qiXtYe_qQXllwAb7wpyMxgGOnMOK8No19ibiDX06RGki5J9EZe2_1CK2fIt-xbBKTADCCIJOZ0cxBRWYYk5HgtvZXNuVI2Ji3zqJzIAi5jtRJ_Z0F5wyTfVwXj5uox7Ap8UWuq3OLnPgKoM7i7TU1YvBttugzrM4wbnUxu-eWQQqpGkaR62RgXV" },
        { id: 6, title: "CYBER SLICK", price: 19.99, tags: ["ARCADE", "RACING"], image: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=2070&auto=format&fit=crop" }
    ]
};

// --- DATA PERSISTENCE ---
function saveToStorage() {
    if (APP_STATE.user) {
        const username = APP_STATE.user.username;
        const stored = localStorage.getItem(`cyberpulse_user_${username}`);
        const parsed = stored ? JSON.parse(stored) : {};

        localStorage.setItem(`cyberpulse_user_${username}`, JSON.stringify({
            ...parsed,
            ownedGames: APP_STATE.ownedGames
        }));
    }
}

function loadUserData(username) {
    const data = localStorage.getItem(`cyberpulse_user_${username}`);
    if (data) {
        const parsed = JSON.parse(data);
        APP_STATE.ownedGames = parsed.ownedGames || [];
    } else {
        APP_STATE.ownedGames = [];
    }
}

// --- UTILS ---
const $ = (id) => document.getElementById(id);
const q = (sel) => document.querySelector(sel);

// --- RENDERERS ---
function renderTrending() {
    const grid = $('trending-grid');
    if (!grid) return;
    grid.innerHTML = APP_STATE.allGames.slice(0, 5).map(game => `
        <div class="glass-card game-card aspect-card running-light cursor-pointer" onclick="addToCart(${game.id})">
            <div class="game-card-img-container">
                <img src="${game.image}" alt="${game.title}">
            </div>
            <div class="absolute inset-0 card-overlay"></div>
            <div class="absolute bottom-0 p-4 w-full">
                <div class="flex gap-2 mb-2">
                    ${game.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <h3 class="game-title">${game.title}</h3>
                <div class="flex items-center justify-between mt-2">
                    <span class="text-primary font-bold text-sm tracking-widest">${game.price === 0 ? 'FREE' : '$' + game.price.toFixed(2)}</span>
                    <button class="material-symbols-outlined add-btn">add_circle</button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderStore() {
    const grid = $('store-grid');
    if (!grid) return;
    grid.innerHTML = APP_STATE.allGames.map(game => {
        const isOwned = APP_STATE.ownedGames.includes(game.id);
        return `
            <div class="glass-card store-item">
                <div class="store-img-container">
                    <img src="${game.image}" alt="${game.title}">
                </div>
                <div class="p-6">
                    <div class="flex gap-2 mb-3">
                         ${game.tags.map(tag => `<span class="tag-small">${tag}</span>`).join('')}
                    </div>
                    <h3 class="game-card-title">${game.title}</h3>
                    <div class="flex justify-between items-center">
                        <span class="text-primary font-black">${game.price === 0 ? 'FREE' : '$' + game.price.toFixed(2)}</span>
                        ${isOwned
                ? `<span class="owned-badge"><span class="material-symbols-outlined text-sm">verified</span> OWNED</span>`
                : `<button onclick="addToCart(${game.id})" class="buy-btn">ADD TO CART</button>`
            }
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderLibrary() {
    const grid = $('library-grid');
    const empty = $('library-empty');
    if (!grid) return;

    const owned = APP_STATE.allGames.filter(g => APP_STATE.ownedGames.includes(g.id));

    if (owned.length === 0) {
        grid.classList.add('hidden');
        empty.classList.remove('hidden');
    } else {
        grid.classList.remove('hidden');
        empty.classList.add('hidden');
        grid.innerHTML = owned.map(game => `
            <div class="glass-card library-item aspect-card relative">
                <img src="${game.image}" class="lib-img" alt="${game.title}">
                <div class="absolute inset-0 lib-overlay"></div>
                <div class="absolute bottom-0 p-4 w-full">
                    <h3 class="lib-title">${game.title}</h3>
                    <button class="btn-primary-small full-width">INITIALIZE</button>
                </div>
            </div>
        `).join('');
    }

    if ($('dash-game-count')) $('dash-game-count').innerText = owned.length;
}


function renderCart() {
    const container = $('cart-items');
    const totEl = $('cart-total');
    const countEl = $('cart-count');
    if (!container) return;

    if (APP_STATE.cart.length === 0) {
        container.innerHTML = `<div class="empty-cart-msg">CARGO BAY EMPTY</div>`;
        totEl.innerText = "$0.00";
        countEl.classList.add('hidden');
        $('checkout-btn').disabled = true;
        return;
    }

    countEl.classList.remove('hidden');
    countEl.innerText = APP_STATE.cart.length;
    $('checkout-btn').disabled = false;

    let total = 0;
    container.innerHTML = APP_STATE.cart.map(gameId => {
        const game = APP_STATE.allGames.find(g => g.id === gameId);
        total += game.price;
        return `
            <div class="cart-item glass-card flex gap-4 items-center">
                <img src="${game.image}" class="cart-img" alt="${game.title}">
                <div class="flex-grow">
                    <h4 class="cart-item-title">${game.title}</h4>
                    <span class="text-primary font-black text-sm">${game.price === 0 ? 'FREE' : '$' + game.price.toFixed(2)}</span>
                </div>
                <button onclick="removeFromCart(${game.id})" class="delete-btn">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;
    }).join('');
    totEl.innerText = `$${total.toFixed(2)}`;
}

// --- ACTIONS ---
window.addToCart = (id) => {
    if (APP_STATE.ownedGames.includes(id)) {
        alert("This asset is already in your archive.");
        return;
    }
    if (APP_STATE.cart.includes(id)) {
        return;
    }
    APP_STATE.cart.push(id);
    renderCart();
    $('cart-drawer').classList.remove('hidden');
};

window.removeFromCart = (id) => {
    APP_STATE.cart = APP_STATE.cart.filter(cid => cid !== id);
    renderCart();
};

function checkout() {
    if (!APP_STATE.user) {
        alert("Authorization required to process transactions.");
        $('auth-modal').classList.remove('hidden');
        return;
    }

    // Move items to owned
    APP_STATE.ownedGames = [...new Set([...APP_STATE.ownedGames, ...APP_STATE.cart])];
    APP_STATE.cart = [];

    saveToStorage();
    renderCart();
    renderStore();
    renderLibrary();

    $('checkout-success').classList.remove('hidden');
    $('checkout-btn').classList.add('hidden');

    setTimeout(() => {
        $('checkout-success').classList.add('hidden');
        $('checkout-btn').classList.remove('hidden');
        $('cart-drawer').classList.add('hidden');
    }, 3000);
}

// --- AUTH LOGIC ---
function showAuthFeedback(msg, type = 'error') {
    const el = $('auth-feedback');
    el.innerText = msg;
    el.className = `auth-feedback ${type}`;
    el.classList.remove('hidden');
}

function clearAuthFeedback() {
    const el = $('auth-feedback');
    if (el) {
        el.classList.add('hidden');
        el.innerText = '';
    }
}

function doRegister() {
    const user = $('reg-username').value.trim();
    const pass = $('reg-password').value.trim();
    const btn = $('do-register-btn');

    if (!user || !pass) {
        showAuthFeedback("Choose both username and password.");
        return;
    }

    if (localStorage.getItem(`cyberpulse_user_${user}`)) {
        showAuthFeedback("Username already synchronized.");
        return;
    }

    btn.classList.add('btn-loading');
    clearAuthFeedback();

    setTimeout(() => {
        localStorage.setItem(`cyberpulse_user_${user}`, JSON.stringify({
            password: pass,
            ownedGames: []
        }));

        btn.classList.remove('btn-loading');
        showAuthFeedback("Grid credentials initialized.", "success");

        setTimeout(() => {
            $('switch-to-login').click();
        }, 1500);
    }, 1200);
}

function doLogin() {
    const user = $('login-email').value.trim();
    const pass = $('login-password').value.trim();
    const btn = $('do-login-btn');

    if (!user || !pass) {
        showAuthFeedback("Enter credentials to harmonize.");
        return;
    }

    btn.classList.add('btn-loading');
    clearAuthFeedback();

    setTimeout(() => {
        const stored = localStorage.getItem(`cyberpulse_user_${user}`);
        const parsed = stored ? JSON.parse(stored) : null;

        if (!parsed || parsed.password !== pass) {
            btn.classList.remove('btn-loading');
            showAuthFeedback("Wrong username or password.");
            return;
        }

        APP_STATE.user = { username: user };
        loadUserData(user);
        updateAuthUI();
        btn.classList.remove('btn-loading');
        $('auth-modal').classList.add('hidden');
        clearAuthInputs();
        renderStore();
        renderLibrary();
    }, 1200);
}

function clearAuthInputs() {
    ['login-email', 'login-password', 'reg-username', 'reg-password'].forEach(id => {
        if ($(id)) $(id).value = '';
    });
}

function logout() {
    APP_STATE.user = null;
    APP_STATE.ownedGames = [];
    clearAuthInputs();
    updateAuthUI();
    renderStore();
    renderLibrary();
}

function updateAuthUI() {
    if (APP_STATE.user) {
        $('auth-buttons').classList.add('hidden');
        $('user-profile').classList.remove('hidden');
        $('user-display-name').innerText = APP_STATE.user.username;
        if ($('dash-username')) $('dash-username').innerText = APP_STATE.user.username;
    } else {
        $('auth-buttons').classList.remove('hidden');
        $('user-profile').classList.add('hidden');
    }
}

// --- NAVIGATION ---
function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.remove('active');
    });

    const activePage = $(`page-${pageId}`);
    if (activePage) activePage.classList.remove('hidden');

    const activeLink = q(`.nav-link[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// --- STARTUP ---
document.addEventListener('DOMContentLoaded', () => {
    // Theme Logic
    const themeToggleBtn = $('theme-toggle-btn');
    const themeIcon = $('theme-icon');

    const savedTheme = localStorage.getItem('cyberpulse_theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeIcon) themeIcon.innerText = 'dark_mode';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('cyberpulse_theme', isLight ? 'light' : 'dark');
            if (themeIcon) themeIcon.innerText = isLight ? 'dark_mode' : 'light_mode';
        });
    }

    // Nav events
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            showPage(link.dataset.page);
            // Close mobile menu on click
            const navContainer = $('nav-links-container');
            if (navContainer) navContainer.classList.remove('mobile-active');
        });
    });

    const mobileMenuBtn = $('mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const navContainer = $('nav-links-container');
            if (navContainer) navContainer.classList.toggle('mobile-active');
        });
    }

    $('nav-logo').addEventListener('click', () => {
        showPage('home');
        const navContainer = $('nav-links-container');
        if (navContainer) navContainer.classList.remove('mobile-active');
    });

    // Cart events
    const closeCart = () => $('cart-drawer').classList.add('hidden');
    $('cart-btn').addEventListener('click', () => $('cart-drawer').classList.remove('hidden'));
    $('close-cart-btn').addEventListener('click', closeCart);
    $('close-cart-overlay').addEventListener('click', closeCart);
    $('checkout-btn').addEventListener('click', checkout);

    // Auth Modal events
    const resetAuthForms = () => {
        clearAuthInputs();
        clearAuthFeedback();
    };
    const closeAuthModal = () => {
        $('auth-modal').classList.add('hidden');
        resetAuthForms();
    };

    $('login-nav-btn').addEventListener('click', () => {
        $('auth-modal').classList.remove('hidden');
        resetAuthForms();
    });
    $('close-auth-modal').addEventListener('click', closeAuthModal);
    document.querySelectorAll('.exit-auth-btn').forEach(btn => btn.addEventListener('click', closeAuthModal));

    $('switch-to-register').addEventListener('click', () => {
        $('login-form').classList.add('hidden');
        $('register-form').classList.remove('hidden');
        resetAuthForms();
    });
    $('switch-to-login').addEventListener('click', () => {
        $('login-form').classList.remove('hidden');
        $('register-form').classList.add('hidden');
        resetAuthForms();
    });

    $('do-register-btn').addEventListener('click', doRegister);
    $('do-login-btn').addEventListener('click', doLogin);
    $('logout-btn').addEventListener('click', logout);

    // Initial render
    renderTrending();
    renderStore();
    renderLibrary();
    renderCart();
    updateAuthUI();

    // Scroll effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) nav.classList.add('bg-black/95');
        else nav.classList.remove('bg-black/95');
    });
});
