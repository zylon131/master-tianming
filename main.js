import { translations, themeTranslations, luckTranslations, yiJiTranslations } from './translations.js';

// --- State Management ---
let currentUser = null;
let activeTab = 'fortune';
let selectedDate = null;
let currentAssistant = 'astrology';
let baziData = null;
let cachedReports = null;
let activeReportSection = null;
let currentLang = localStorage.getItem('currentLang') || 'zh';
let currentDailyFortune = null;
let googleClientId = "";
let googleTokenClient = null;

// Chat histories cached in memory for smooth transitions
const chatHistories = {
    astrology: [
        { role: 'bot', text: '您好，我是您的测算童子。已根据您的八字排盘，您可以随时问我关于您的事业、学业、感情或健康问题。' }
    ],
    dasiming: [
        { role: 'bot', text: '吾乃大司命，主掌世人寿夭与祸福。今开命局，汝有何求？' }
    ]
};

// Help map stems & branches to element colors for rich premium aesthetics
const ELEMENT_COLORS = {
    '木': '#2e7d32', // Green
    '火': '#c62828', // Red
    '土': '#b38f4d', // Gold Earth
    '金': '#9e9e9e', // Gray Metal
    '水': '#1565c0'  // Blue Water
};

// Helper: Get element of a celestial stem or earthly branch
function getElementColor(char) {
    const wood = '甲乙寅卯';
    const fire = '丙丁巳午';
    const earth = '戊己辰戌丑未';
    const metal = '庚辛申酉';
    const water = '壬癸亥子';
    
    if (wood.includes(char)) return ELEMENT_COLORS['木'];
    if (fire.includes(char)) return ELEMENT_COLORS['火'];
    if (earth.includes(char)) return ELEMENT_COLORS['土'];
    if (metal.includes(char)) return ELEMENT_COLORS['金'];
    if (water.includes(char)) return ELEMENT_COLORS['水'];
    return '#8b5a2b';
}

// Helper: Format Date object as YYYY-MM-DD
function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// Helper: Get day of week name
function getWeekdayName(date) {
    const keys = ['day_sunday', 'day_monday', 'day_tuesday', 'day_wednesday', 'day_thursday', 'day_friday', 'day_saturday'];
    const key = keys[date.getDay()];
    return translations[currentLang][key] || key;
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    selectedDate = formatDate(new Date());
    
    // Check local storage for session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        try {
            currentUser = JSON.parse(storedUser);
        } catch (e) {
            console.error("Error parsing stored user:", e);
            localStorage.removeItem('currentUser');
        }
    }
    
    // Bind all DOM events & UI controls
    initAppControls();
    
    // Enforce bilingual translations
    changeLanguage(currentLang);
    
    // Fetch configuration for Google OAuth
    fetchConfig();
    
    if (currentUser) {
        // Logged in
        setupUserSession();
        switchTab('fortune');
    } else {
        // Guest mode - prompt registration
        showForceRegisterModal();
    }
});

// Setup active user layout & fetch profile details
async function setupUserSession() {
    if (!currentUser) return;
    
    // Toggle sidebar cards
    document.getElementById('sidebar-user-guest').style.display = 'none';
    const userCard = document.getElementById('sidebar-user-card');
    userCard.style.display = 'flex';
    document.getElementById('sidebar-username').innerText = currentUser.fullname;
    
    const tierBadge = document.getElementById('sidebar-tier-badge');
    tierBadge.innerText = currentUser.tier === 'master' ? 'Master' : 'Free';
    if (currentUser.tier === 'master') {
        tierBadge.style.background = 'var(--gold)';
        tierBadge.style.color = '#fff';
    } else {
        tierBadge.style.background = 'rgba(0, 0, 0, 0.05)';
        tierBadge.style.color = '#777';
    }
    
    // Hide force modal
    document.getElementById('register-force-modal').style.display = 'none';
    
    // Render profile details page fields
    document.getElementById('profile-auth-container').style.display = 'none';
    document.getElementById('profile-info-container').style.display = 'block';
    
    updateProfileUI();
    
    // Fetch profile & calculate Bazi from backend
    try {
        const res = await fetch(`/api/user/profile?username=${encodeURIComponent(currentUser.username)}`);
        if (res.ok) {
            const data = await res.json();
            if (data.success) {
                baziData = data.bazi;
                currentUser = data.user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Update Bazi indicators on dashboard pages
                const pillarsStr = baziData.pillars.join('  ');
                document.getElementById('profile-val-pillars').innerText = pillarsStr;
                document.getElementById('report-user-pillars').innerText = pillarsStr;
                document.getElementById('annual-pillars-lbl').innerText = pillarsStr;
                
                document.getElementById('report-user-name').innerText = (currentLang === 'zh' ? '姓名：' : 'Name: ') + currentUser.fullname;
                document.getElementById('report-user-birth').innerText = (currentLang === 'zh' ? '生日：' : 'DOB: ') + currentUser.dob;
                
                document.getElementById('annual-fullname-lbl').innerText = (currentLang === 'zh' ? '姓名：' : 'Name: ') + currentUser.fullname;
                document.getElementById('annual-birth-lbl').innerText = (currentLang === 'zh' ? '生日：' : 'DOB: ') + currentUser.dob;
                
                // Update badge in case it changed
                const badge = document.getElementById('sidebar-tier-badge');
                badge.innerText = currentUser.tier === 'master' ? 'Master' : 'Free';
                if (currentUser.tier === 'master') {
                    badge.style.background = 'var(--gold)';
                    badge.style.color = '#fff';
                }
                
                updateProfileUI();
            }
        }
    } catch (err) {
        console.error("Error fetching user profile:", err);
    }
    
    // Render calendar week
    renderCalendarWeek();
    
    // Fetch daily fortune
    loadDailyFortune(selectedDate);
    
    // Check limits for chat
    updateChatLimitDisplay();
}

// Show forced register popup if not logged in
function showForceRegisterModal() {
    document.getElementById('register-force-modal').style.display = 'flex';
    document.getElementById('sidebar-user-guest').style.display = 'flex';
    document.getElementById('sidebar-user-card').style.display = 'none';
    switchTab('profile');
}

// Fetch config from backend
async function fetchConfig() {
    try {
        const res = await fetch('/api/config');
        if (res.ok) {
            const config = await res.json();
            googleClientId = config.googleClientId;
            initGoogleGIS();
        }
    } catch (err) {
        console.error("Failed to fetch client configuration:", err);
    }
}

// Initialize Google GIS Token Client
function initGoogleGIS() {
    const urlParams = new URLSearchParams(window.location.search);
    const forceMock = urlParams.get('mock_google') === 'true' || localStorage.getItem('mock_google') === 'true';
    if (forceMock || !googleClientId || googleClientId === 'mock_google_client_id') {
        console.log("[Google Sign-In] Mock client ID or empty. Falling back to local popup.");
        return;
    }
    
    if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
        // Load the script dynamically if not present
        if (!document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
            console.log("[Google Sign-In] Loading Google Identity Services script dynamically...");
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
        console.warn("[Google Sign-In] GIS SDK not loaded yet. Retrying in 1s...");
        setTimeout(initGoogleGIS, 1000);
        return;
    }

    
    try {
        googleTokenClient = google.accounts.oauth2.initTokenClient({
            client_id: googleClientId,
            scope: 'profile email',
            callback: async (tokenResponse) => {
                if (tokenResponse && tokenResponse.access_token) {
                    await handleGoogleToken(tokenResponse.access_token);
                }
            },
            error_callback: (err) => {
                console.error("Google GIS client error:", err);
            }
        });
        console.log("[Google Sign-In] GIS client successfully initialized.");
    } catch (err) {
        console.error("Error initializing Google GIS:", err);
    }
}

// Trigger Google login (using either GIS or mock popup based on client config)
function openGoogleLogin() {
    const urlParams = new URLSearchParams(window.location.search);
    const forceMock = urlParams.get('mock_google') === 'true' || localStorage.getItem('mock_google') === 'true';
    if (googleTokenClient && !forceMock) {
        console.log("[Google Sign-In] Triggering Google Identity Services access token flow.");
        googleTokenClient.requestAccessToken();
    } else {
        console.log("[Google Sign-In] Google Client ID not configured or mock mode. Opening simulator.");
        const width = 500;
        const height = 600;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        
        const popup = window.open(
            'google-login-sim.html',
            'GoogleSignIn',
            `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
        );
        if (popup) {
            popup.focus();
        }
    }
}

// Handle Google access token validation with backend
async function handleGoogleToken(accessToken) {
    try {
        const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken })
        });
        
        if (res.ok) {
            const data = await res.json();
            if (data.success) {
                if (data.exists) {
                    // Log in existing user
                    currentUser = data.user;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    await setupUserSession();
                    switchTab('fortune');
                } else {
                    // New user: display profile completion modal
                    window.googlePendingAuth = {
                        googleId: data.profile.googleId,
                        email: data.profile.email,
                        name: data.profile.name
                    };
                    
                    document.getElementById('gcomplete-fullname').value = data.profile.name || '';
                    document.getElementById('gcomplete-error-msg').style.display = 'none';
                    document.getElementById('google-profile-complete-modal').style.display = 'flex';
                }
            } else {
                alert(currentLang === 'en' ? 'Google authentication failed: ' + data.error : '谷歌登录失败：' + data.error);
            }
        } else {
            alert(currentLang === 'en' ? 'Unable to connect to auth server.' : '无法连接到认证服务器。');
        }
    } catch (err) {
        console.error("Google token handler error:", err);
        alert(currentLang === 'en' ? 'An unexpected authentication error occurred.' : '登录发生未知错误。');
    }
}

// Handle Google Auth success callback
async function handleGoogleAuthSuccess(googleId, email, name) {
    try {
        const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ googleId, email })
        });
        
        if (res.ok) {
            const data = await res.json();
            if (data.success) {
                if (data.exists) {
                    // Log in existing user
                    currentUser = data.user;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    await setupUserSession();
                    switchTab('fortune');
                } else {
                    // New Google user: cache credentials and prompt for birth details
                    window.googlePendingAuth = { googleId, email, name };
                    
                    // Pre-fill name
                    document.getElementById('gcomplete-fullname').value = name;
                    document.getElementById('gcomplete-error-msg').style.display = 'none';
                    
                    // Show modal
                    document.getElementById('google-profile-complete-modal').style.display = 'flex';
                }
            } else {
                alert(currentLang === 'en' ? 'Google authentication failed.' : '谷歌登录失败。');
            }
        } else {
            alert(currentLang === 'en' ? 'Unable to connect to auth server.' : '无法连接到认证服务器。');
        }
    } catch (err) {
        console.error("Google auth error:", err);
        alert(currentLang === 'en' ? 'An unexpected authentication error occurred.' : '登录发生未知错误。');
    }
}

// Initialize SPA routing controls and events
function initAppControls() {
    // Language Switchers Click
    const langBtns = document.querySelectorAll('.lang-switcher .lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            changeLanguage(lang);
        });
    });

    // Google Sign-In Buttons Click
    document.querySelectorAll('.btn-google-login').forEach(btn => {
        btn.addEventListener('click', openGoogleLogin);
    });

    // Message listener for Google Login popup
    window.addEventListener('message', async (event) => {
        if (event.data && event.data.type === 'google-auth-success') {
            const { googleId, email, name } = event.data;
            await handleGoogleAuthSuccess(googleId, email, name);
        }
    });

    // Google Profile Completion Form Submit
    const googleCompleteForm = document.getElementById('google-profile-complete-form');
    if (googleCompleteForm) {
        googleCompleteForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fullname = document.getElementById('gcomplete-fullname').value.trim();
            const gender = document.querySelector('input[name="gcomplete-gender"]:checked').value;
            const year = document.getElementById('gcomplete-dob-year').value;
            const month = document.getElementById('gcomplete-dob-month').value;
            const day = document.getElementById('gcomplete-dob-day').value;
            const tob = document.getElementById('gcomplete-tob').value;
            const errMsg = document.getElementById('gcomplete-error-msg');
            errMsg.style.display = 'none';
            
            if (!year || !month || !day) {
                errMsg.innerText = currentLang === 'zh' ? '请选择出生年月日。' : 'Please select birth date.';
                errMsg.style.display = 'block';
                return;
            }
            
            const dob = `${year}-${month}-${day}`;
            
            if (!window.googlePendingAuth) {
                errMsg.innerText = currentLang === 'zh' ? '会话已过期，请重新登录。' : 'Session expired. Please log in again.';
                errMsg.style.display = 'block';
                return;
            }
            
            const registerPayload = {
                googleId: window.googlePendingAuth.googleId,
                email: window.googlePendingAuth.email,
                name: window.googlePendingAuth.name,
                fullname,
                gender,
                dob,
                tob
            };
            
            try {
                const res = await fetch('/api/auth/google-register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registerPayload)
                });
                const data = await res.json();
                
                if (res.ok && data.success) {
                    currentUser = data.user;
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    // Close Google complete modal
                    document.getElementById('google-profile-complete-modal').style.display = 'none';
                    window.googlePendingAuth = null;
                    
                    await setupUserSession();
                    switchTab('fortune');
                } else {
                    errMsg.innerText = data.error || (currentLang === 'zh' ? '注册失败，请重试。' : 'Registration failed, please try again.');
                    errMsg.style.display = 'block';
                }
            } catch (err) {
                console.error("Google register error:", err);
                errMsg.innerText = currentLang === 'zh' ? '无法连接到服务器。' : 'Unable to connect to the server.';
                errMsg.style.display = 'block';
            }
        });
    }

    // Sidebar tabs click
    const sidebarItems = document.querySelectorAll('.sidebar-nav .sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabName = item.dataset.tab;
            
            // Protection: Force register if not logged in (unless clicking profile tab)
            if (!currentUser && tabName !== 'profile') {
                showForceRegisterModal();
                return;
            }
            
            switchTab(tabName);
        });
    });
    
    // Guest sidebar card click
    document.getElementById('sidebar-user-guest').addEventListener('click', () => {
        switchTab('profile');
        document.getElementById('register-force-modal').style.display = 'none';
    });
    
    // Force modal CTA
    document.getElementById('btn-force-go-profile').addEventListener('click', () => {
        document.getElementById('register-force-modal').style.display = 'none';
        switchTab('profile');
    });
    
    // Daily vs Annual Subview Switches (Fortune Tab)
    document.getElementById('btn-fortune-daily').addEventListener('click', () => {
        document.getElementById('btn-fortune-daily').classList.add('active');
        document.getElementById('btn-fortune-annual').classList.remove('active');
        document.getElementById('fortune-daily-subview').style.display = 'block';
        document.getElementById('fortune-annual-subview').style.display = 'none';
        document.getElementById('fortune-calendar-week').style.display = 'flex';
    });
    
    document.getElementById('btn-fortune-annual').addEventListener('click', () => {
        document.getElementById('btn-fortune-daily').classList.remove('active');
        document.getElementById('btn-fortune-annual').classList.add('active');
        document.getElementById('fortune-daily-subview').style.display = 'none';
        document.getElementById('fortune-annual-subview').style.display = 'block';
        document.getElementById('fortune-calendar-week').style.display = 'none';
        
        loadAnnualBook();
    });
    
    // Profile forms switches
    document.getElementById('btn-auth-switch-login').addEventListener('click', () => {
        document.getElementById('btn-auth-switch-login').classList.add('active');
        document.getElementById('btn-auth-switch-register').classList.remove('active');
        document.getElementById('auth-login-form').style.display = 'block';
        document.getElementById('auth-register-form').style.display = 'none';
    });
    
    document.getElementById('btn-auth-switch-register').addEventListener('click', () => {
        document.getElementById('btn-auth-switch-login').classList.remove('active');
        document.getElementById('btn-auth-switch-register').classList.add('active');
        document.getElementById('auth-login-form').style.display = 'none';
        document.getElementById('auth-register-form').style.display = 'block';
    });
    
    // Login Form Submit
    document.getElementById('auth-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value.trim();
        const errMsg = document.getElementById('login-error-msg');
        errMsg.style.display = 'none';
        
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                currentUser = data.user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                await setupUserSession();
                switchTab('fortune');
            } else {
                errMsg.innerText = data.error || (currentLang === 'zh' ? '登录失败，请检查账号密码。' : 'Login failed, please check username and password.');
                errMsg.style.display = 'block';
            }
        } catch (err) {
            errMsg.innerText = currentLang === 'zh' ? '无法连接到服务器。' : 'Unable to connect to the server.';
            errMsg.style.display = 'block';
        }
    });
    
    // Register Form Submit
    document.getElementById('auth-register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value.trim();
        const password = document.getElementById('reg-password').value.trim();
        const fullname = document.getElementById('reg-fullname').value.trim();
        const gender = document.querySelector('input[name="reg-gender"]:checked').value;
        const year = document.getElementById('reg-dob-year').value;
        const month = document.getElementById('reg-dob-month').value;
        const day = document.getElementById('reg-dob-day').value;
        const tob = document.getElementById('reg-tob').value;
        const errMsg = document.getElementById('register-error-msg');
        errMsg.style.display = 'none';
        
        if (!year || !month || !day) {
            errMsg.innerText = currentLang === 'zh' ? '请选择出生年月日。' : 'Please select birth date.';
            errMsg.style.display = 'block';
            return;
        }
        
        const dob = `${year}-${month}-${day}`;
        
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, fullname, gender, dob, tob })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                currentUser = data.user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                await setupUserSession();
                switchTab('fortune');
            } else {
                errMsg.innerText = data.error || (currentLang === 'zh' ? '注册失败，请检查填写内容。' : 'Registration failed, please check input details.');
                errMsg.style.display = 'block';
            }
        } catch (err) {
            errMsg.innerText = currentLang === 'zh' ? '无法连接到服务器。' : 'Unable to connect to the server.';
            errMsg.style.display = 'block';
        }
    });
    
    // Logout Click
    document.getElementById('btn-profile-logout').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        currentUser = null;
        baziData = null;
        cachedReports = null;
        currentDailyFortune = null;
        
        // Reset navigation
        document.getElementById('profile-auth-container').style.display = 'block';
        document.getElementById('profile-info-container').style.display = 'none';
        document.getElementById('auth-login-form').reset();
        document.getElementById('auth-register-form').reset();
        
        showForceRegisterModal();
    });
    
    // Checkout Popups triggers (Bind to class btn-trigger-checkout)
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-trigger-checkout')) {
            e.preventDefault();
            showStripeCheckout();
        }
    });
    
    // Close Stripe Modal
    document.getElementById('stripe-modal-close').addEventListener('click', () => {
        document.getElementById('stripe-checkout-modal').style.display = 'none';
    });
    
    // Stripe Form input auto formatting helper
    const cardNumInput = document.getElementById('stripe-card-num');
    cardNumInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        let formatted = '';
        for (let i = 0; i < val.length; i++) {
            if (i > 0 && i % 4 === 0) formatted += ' ';
            formatted += val[i];
        }
        e.target.value = formatted.substring(0, 19);
    });
    
    const cardExpiryInput = document.getElementById('stripe-card-expiry');
    cardExpiryInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        let formatted = '';
        if (val.length > 2) {
            formatted = val.substring(0, 2) + ' / ' + val.substring(2, 4);
        } else {
            formatted = val;
        }
        e.target.value = formatted;
    });
    
    const cardCvcInput = document.getElementById('stripe-card-cvc');
    cardCvcInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
    });
    
    // Stripe Checkout Form Submit
    document.getElementById('stripe-payment-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('stripe-submit-btn');
        const errorMsg = document.getElementById('stripe-error-msg');
        errorMsg.style.display = 'none';
        
        submitBtn.disabled = true;
        submitBtn.innerText = currentLang === 'zh' ? '正在验证安全付款...' : 'Processing secure payment...';
        
        try {
            const res = await fetch('/api/subscribe/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: currentUser.username })
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                // Update local storage
                currentUser.tier = 'master';
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Show success view after brief delay
                setTimeout(() => {
                    document.getElementById('stripe-payment-form').style.display = 'none';
                    document.getElementById('stripe-success-view').style.display = 'block';
                }, 1000);
            } else {
                submitBtn.disabled = false;
                submitBtn.innerText = translations[currentLang].stripe_btn_pay || 'Pay $99.99 Now';
                errorMsg.innerText = data.error || (currentLang === 'zh' ? '信用卡扣款失败，请换卡重试。' : 'Credit card payment failed. Please check parameters.');
                errorMsg.style.display = 'block';
            }
        } catch (err) {
            submitBtn.disabled = false;
            submitBtn.innerText = translations[currentLang].stripe_btn_pay || 'Pay $99.99 Now';
            errorMsg.innerText = currentLang === 'zh' ? '无法连接到支付服务器。' : 'Unable to connect to the payment server.';
            errorMsg.style.display = 'block';
        }
    });
    
    // Stripe Success Button Click (Close and reload SaaS dashboard features)
    document.getElementById('stripe-success-close-btn').addEventListener('click', async () => {
        document.getElementById('stripe-checkout-modal').style.display = 'none';
        // Reset checkout view for next time
        document.getElementById('stripe-payment-form').style.display = 'block';
        document.getElementById('stripe-payment-form').reset();
        document.getElementById('stripe-success-view').style.display = 'none';
        document.getElementById('stripe-submit-btn').disabled = false;
        document.getElementById('stripe-submit-btn').innerText = translations[currentLang].stripe_btn_pay || 'Pay $99.99 Now';
        
        // Refresh session
        await setupUserSession();
        
        // Reload currently visible view
        if (activeTab === 'report') {
            loadDestinyReports();
        } else if (activeTab === 'fortune' && document.getElementById('btn-fortune-annual').classList.contains('active')) {
            loadAnnualBook();
        }
        
        // Refresh the opened report modal if visible
        const reportOverlay = document.getElementById('report-view-overlay');
        if (reportOverlay && reportOverlay.style.display === 'flex' && activeReportSection) {
            openReportModal(activeReportSection);
        }
    });
    
    // Destiny Report expansion modal setup
    const reportGrid = document.getElementById('report-dashboard-grid');
    reportGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.bazi-report-card');
        if (!card) return;
        
        const section = card.dataset.section;
        openReportModal(section);
    });
    
    document.getElementById('report-overlay-close').addEventListener('click', () => {
        document.getElementById('report-view-overlay').style.display = 'none';
    });
    
    // AI Chat Panel assistant button switches
    document.getElementById('btn-chat-astrology').addEventListener('click', () => {
        switchAssistant('astrology');
    });
    document.getElementById('btn-chat-dasiming').addEventListener('click', () => {
        switchAssistant('dasiming');
    });
    
    // Chat Message Inputs
    document.getElementById('chat-send-btn').addEventListener('click', sendChatMessage);
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
    
    // Chat suggestions clicks
    const suggestionsBar = document.getElementById('chat-suggestions-bar');
    suggestionsBar.addEventListener('click', (e) => {
        const chip = e.target.closest('.chat-suggestion-chip');
        if (!chip) return;
        
        const text = chip.innerText.replace(' ↻', '').trim();
        document.getElementById('chat-input').value = text;
        sendChatMessage();
    });
}

// Tab switcher logic
function switchTab(tabName) {
    activeTab = tabName;
    
    // Update sidebar items
    const sidebarItems = document.querySelectorAll('.sidebar-nav .sidebar-item');
    sidebarItems.forEach(item => {
        if (item.dataset.tab === tabName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Toggle active view panel
    const panels = document.querySelectorAll('.view-panel');
    panels.forEach(panel => {
        if (panel.id === `view-${tabName}`) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });
    
    // Trigger lazy loading of data depending on view
    if (tabName === 'report' && currentUser) {
        loadDestinyReports();
    }
}

// Generate DOB dropdown ranges bilingually
function setupDOBSelectors(yearId, monthId, dayId) {
    const yearSelect = document.getElementById(yearId);
    const monthSelect = document.getElementById(monthId);
    const daySelect = document.getElementById(dayId);
    
    if (!yearSelect || !monthSelect || !daySelect) return;
    
    const currentYear = new Date().getFullYear();
    const prevYear = yearSelect.value;
    const prevMonth = monthSelect.value;
    const prevDay = daySelect.value;
    
    const yearPlaceholder = currentLang === 'zh' ? '年' : 'Year';
    const monthPlaceholder = currentLang === 'zh' ? '月' : 'Month';
    const dayPlaceholder = currentLang === 'zh' ? '日' : 'Day';
    
    // Populate Years
    let yearOptions = `<option value="" disabled ${!prevYear ? 'selected' : ''}>${yearPlaceholder}</option>`;
    for (let i = currentYear; i >= 1920; i--) {
        yearOptions += `<option value="${i}" ${prevYear == i ? 'selected' : ''}>${i}</option>`;
    }
    yearSelect.innerHTML = yearOptions;
    
    // Populate Months
    let monthOptions = `<option value="" disabled ${!prevMonth ? 'selected' : ''}>${monthPlaceholder}</option>`;
    for (let i = 1; i <= 12; i++) {
        const v = String(i).padStart(2, '0');
        monthOptions += `<option value="${v}" ${prevMonth === v ? 'selected' : ''}>${i}</option>`;
    }
    monthSelect.innerHTML = monthOptions;
    
    // Update Days dynamically
    const updateDays = () => {
        const y = parseInt(yearSelect.value);
        const m = parseInt(monthSelect.value);
        let daysInMonth = 31;
        
        if (m) {
            if (m === 2) {
                daysInMonth = (y && y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? 29 : 28;
            } else if ([4, 6, 9, 11].includes(m)) {
                daysInMonth = 30;
            }
        }
        
        const currentSelectedDay = daySelect.value || prevDay;
        let dayOptions = `<option value="" disabled ${!currentSelectedDay ? 'selected' : ''}>${dayPlaceholder}</option>`;
        for (let i = 1; i <= daysInMonth; i++) {
            const v = String(i).padStart(2, '0');
            const selected = v === currentSelectedDay ? 'selected' : '';
            dayOptions += `<option value="${v}" ${selected}>${i}</option>`;
        }
        daySelect.innerHTML = dayOptions;
    };
    
    yearSelect.onchange = updateDays;
    monthSelect.onchange = updateDays;
    updateDays();
}

function initAllDOBSelectors() {
    setupDOBSelectors('reg-dob-year', 'reg-dob-month', 'reg-dob-day');
    setupDOBSelectors('gcomplete-dob-year', 'gcomplete-dob-month', 'gcomplete-dob-day');
}

// Render Calendar week slider centered around today
function renderCalendarWeek() {
    const container = document.getElementById('fortune-calendar-week');
    if (!container) return;
    
    container.innerHTML = '';
    const todayStr = formatDate(new Date());
    const isMaster = currentUser && currentUser.tier === 'master';
    const isTodayText = currentLang === 'zh' ? '今天' : 'Today';
    
    // Compute 7 days (-3 to +3 relative to today)
    for (let i = -3; i <= 3; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        const dateStr = formatDate(d);
        const weekday = getWeekdayName(d);
        const dateNum = d.getDate();
        
        const isToday = dateStr === todayStr;
        const isActive = dateStr === selectedDate;
        const isLocked = !isToday && !isMaster;
        
        const activeClass = isActive ? 'active' : '';
        const lockBadge = isLocked ? '<span class="calendar-lock-badge">🔒</span>' : '';
        
        const btn = document.createElement('button');
        btn.className = `calendar-day-btn ${activeClass}`;
        btn.dataset.date = dateStr;
        btn.innerHTML = `
            <span class="calendar-day-lbl">${isToday ? isTodayText : weekday}</span>
            <span class="calendar-date-lbl">${dateNum}</span>
            ${lockBadge}
        `;
        
        btn.addEventListener('click', () => {
            if (isToday || isMaster) {
                // Set selected date
                selectedDate = dateStr;
                
                // Highlight active button
                const btns = container.querySelectorAll('.calendar-day-btn');
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Load daily fortune
                loadDailyFortune(dateStr);
            } else {
                // Show simulated paywall checkout
                showStripeCheckout();
            }
        });
        
        container.appendChild(btn);
    }
}

// Fetch Daily Fortune details from server
async function loadDailyFortune(dateStr) {
    if (!currentUser) return;
    
    // Display loading text or brief placeholder spinner
    document.getElementById('fortune-details-date').innerText = dateStr;
    document.getElementById('fortune-details-text').innerText = currentLang === 'zh' ? '正在推演今日天命星盘...' : 'Casting cosmic chart for today...';
    
    try {
        const dob = currentUser.dob;
        const tob = currentUser.tob;
        const res = await fetch(`/api/daily-fortune?date=${dateStr}&dob=${encodeURIComponent(dob)}&tob=${encodeURIComponent(tob)}`);
        
        if (res.ok) {
            const data = await res.json();
            if (data.success) {
                currentDailyFortune = data.fortune;
                renderDailyFortuneUI(currentDailyFortune);
            }
        }
    } catch (err) {
        console.error("Daily fortune error:", err);
        document.getElementById('fortune-details-text').innerText = currentLang === 'zh' ? '推演错误，请检查网络。' : 'Calculation error, please check network.';
    }
}

// Render Daily Fortune details onto page
function renderDailyFortuneUI(f) {
    if (!f) return;
    
    // 1. Luck
    const translatedLuck = currentLang === 'en' ? (luckTranslations[f.luck] || f.luck) : f.luck;
    const luckInd = document.getElementById('fortune-luck-indicator');
    luckInd.innerText = translatedLuck;
    
    if (f.luck === '高') {
        luckInd.style.color = '#2e7d32';
    } else if (f.luck === '低') {
        luckInd.style.color = '#c62828';
    } else {
        luckInd.style.color = 'var(--gold)';
    }
    
    // 2. Ganzhi
    const stemsChar = f.ganzhi[0];
    const branchChar = f.ganzhi[1];
    
    const badgeContainer = document.getElementById('fortune-ganzhi-badge');
    if (badgeContainer) {
        badgeContainer.innerHTML = `
            <div class="ganzhi-ring" style="background: ${getElementColor(stemsChar)}">${stemsChar}</div>
            <div class="ganzhi-ring" style="background: ${getElementColor(branchChar)}">${branchChar}</div>
        `;
    }
    
    // 3. Theme / Verse
    const translatedTheme = currentLang === 'en' ? (themeTranslations[f.theme] || f.theme) : f.theme;
    document.getElementById('fortune-verse').innerText = translatedTheme;
    
    // 4. Details
    const detailsText = f.details[currentLang] || f.details.zh;
    document.getElementById('fortune-details-text').innerText = detailsText;
    
    // 5. Yi / Ji
    const yiList = document.getElementById('fortune-yi-list');
    const jiList = document.getElementById('fortune-ji-list');
    
    if (yiList && jiList) {
        const translatedYi = f.yi.map(item => currentLang === 'en' ? (yiJiTranslations[item] || item) : item);
        const translatedJi = f.ji.map(item => currentLang === 'en' ? (yiJiTranslations[item] || item) : item);
        
        yiList.innerHTML = translatedYi.map(item => `<li>${item}</li>`).join('');
        jiList.innerHTML = translatedJi.map(item => `<li>${item}</li>`).join('');
    }
}

// Fetch & render Destiny Book detailed report cards
async function loadDestinyReports() {
    if (!currentUser) return;
    
    const isMaster = currentUser.tier === 'master';
    
    // Update card lock visibility
    const reportCards = document.querySelectorAll('.bazi-report-card');
    reportCards.forEach(card => {
        const label = card.querySelector('.report-status-lbl');
        if (label) {
            if (isMaster) {
                label.innerText = translations[currentLang].report_status_unlocked;
                label.style.color = '#2e7d32';
            } else {
                label.innerText = translations[currentLang].report_status_locked;
                label.style.color = '#888';
            }
        }
    });
    
    // Pre-fetch reports payload from backend to cache in memory
    try {
        const res = await fetch(`/api/bazi-report?username=${encodeURIComponent(currentUser.username)}`);
        if (res.ok) {
            const data = await res.json();
            if (data.success) {
                cachedReports = data.unlocked ? data.reports : null;
            }
        }
    } catch (err) {
        console.error("Bazi report query failure:", err);
    }
}

// Open report detail Modal with premium checks
async function openReportModal(section) {
    activeReportSection = section;
    const modal = document.getElementById('report-view-overlay');
    const titleSpan = document.getElementById('report-overlay-title');
    const lockedDiv = document.getElementById('report-overlay-locked');
    const unlockedDiv = document.getElementById('report-overlay-unlocked');
    
    if (!modal || !titleSpan || !lockedDiv || !unlockedDiv) return;
    
    // Card sections labels dictionary
    const labels = {
        wuxing: translations[currentLang].report_wuxing_title,
        yongshen: translations[currentLang].report_yongshen_title,
        career: translations[currentLang].report_career_title,
        marriage: translations[currentLang].report_marriage_title,
        growth: translations[currentLang].report_growth_title,
        health: translations[currentLang].report_health_title
    };
    
    titleSpan.innerText = labels[section] || (currentLang === 'zh' ? '天命解析' : 'Destiny Reading');
    modal.style.display = 'flex';
    
    const isMaster = currentUser && currentUser.tier === 'master';
    
    if (isMaster) {
        lockedDiv.style.display = 'none';
        unlockedDiv.style.display = 'block';
        unlockedDiv.innerHTML = currentLang === 'zh' ? '<p style="color:#777;">正在调阅命理档中...</p>' : '<p style="color:#777;">Retrieving destiny records...</p>';
        
        // Fetch or load from cache
        if (!cachedReports) {
            try {
                const res = await fetch(`/api/bazi-report?username=${encodeURIComponent(currentUser.username)}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.unlocked) {
                        cachedReports = data.reports;
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
        
        if (cachedReports && cachedReports[section]) {
            unlockedDiv.innerHTML = currentLang === 'en' ? cachedReports[section].content_en : cachedReports[section].content_zh;
        } else {
            unlockedDiv.innerHTML = currentLang === 'zh' ? '<p style="color:var(--cinnabar);">读取档案失败，请稍后刷新重试。</p>' : '<p style="color:var(--cinnabar);">Failed to retrieve record, please refresh and try again.</p>';
        }
    } else {
        lockedDiv.style.display = 'flex';
        unlockedDiv.style.display = 'none';
    }
}

// Load Annual Book subview content
async function loadAnnualBook() {
    if (!currentUser) return;
    
    const isMaster = currentUser.tier === 'master';
    const lockOverlay = document.getElementById('annual-lock-overlay');
    const contentDiv = document.getElementById('annual-unlocked-content');
    
    if (!lockOverlay || !contentDiv) return;
    
    if (isMaster) {
        lockOverlay.style.display = 'none';
        contentDiv.style.display = 'block';
        contentDiv.innerHTML = currentLang === 'zh' ? '<p style="color:#777;">正在与天官调阅丙午年运书书卷...</p>' : '<p style="color:#777;">Retrieving the 2026 BingWu Annual Horoscope book...</p>';
        
        try {
            const res = await fetch(`/api/bazi-report?username=${encodeURIComponent(currentUser.username)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.unlocked) {
                    contentDiv.innerHTML = currentLang === 'en' ? data.reports.annual2026.content_en : data.reports.annual2026.content_zh;
                } else {
                    contentDiv.innerHTML = currentLang === 'zh' ? '<p style="color:var(--cinnabar);">无法加载运书内容，请稍后重试。</p>' : '<p style="color:var(--cinnabar);">Failed to load horoscope. Please try again later.</p>';
                }
            }
        } catch (e) {
            contentDiv.innerHTML = currentLang === 'zh' ? '<p style="color:var(--cinnabar);">数据加载失败，请检查您的网络连接。</p>' : '<p style="color:var(--cinnabar);">Data loading failed. Please check your network connection.</p>';
        }
    } else {
        lockOverlay.style.display = 'flex';
        contentDiv.style.display = 'none';
    }
}

// Open checkout payment modal
function showStripeCheckout() {
    // Reset payment views
    document.getElementById('stripe-payment-form').style.display = 'block';
    document.getElementById('stripe-payment-form').reset();
    document.getElementById('stripe-success-view').style.display = 'none';
    
    const submitBtn = document.getElementById('stripe-submit-btn');
    submitBtn.disabled = false;
    submitBtn.innerText = translations[currentLang].stripe_btn_pay || 'Pay $99.99 Now';
    
    document.getElementById('stripe-error-msg').style.display = 'none';
    
    if (currentUser) {
        document.getElementById('stripe-email').value = currentUser.username + '@tianming.com';
    }
    
    document.getElementById('stripe-checkout-modal').style.display = 'flex';
}

// Switch chatbot assistants
function switchAssistant(assistant) {
    currentAssistant = assistant;
    
    const btnAstrology = document.getElementById('btn-chat-astrology');
    const btnDaSiMing = document.getElementById('btn-chat-dasiming');
    
    if (!btnAstrology || !btnDaSiMing) return;
    
    if (assistant === 'astrology') {
        btnAstrology.classList.add('active');
        btnDaSiMing.classList.remove('active');
    } else {
        btnDaSiMing.classList.add('active');
        btnAstrology.classList.remove('active');
    }
    
    updateAssistantDetailsUI();
    
    // Render stored chat bubble log history
    renderChatMessages();
}

function updateAssistantDetailsUI() {
    const nameLbl = document.getElementById('chat-assistant-name');
    const descLbl = document.getElementById('chat-assistant-desc');
    if (!nameLbl || !descLbl) return;

    if (currentAssistant === 'astrology') {
        nameLbl.innerText = translations[currentLang].assistant_selector_astrology;
        descLbl.innerText = translations[currentLang].assistant_desc_astrology;
    } else {
        nameLbl.innerText = translations[currentLang].assistant_selector_dasiming;
        descLbl.innerText = translations[currentLang].assistant_desc_dasiming;
    }
}

function updateChatSuggestions() {
    const chips = document.querySelectorAll('.chat-suggestion-chip');
    if (chips.length >= 3) {
        chips[0].innerHTML = `${translations[currentLang].chip_1} ↻`;
        chips[1].innerHTML = `${translations[currentLang].chip_2} ↻`;
        chips[2].innerHTML = `${translations[currentLang].chip_3} ↻`;
    }
}

// Render active assistant chat dialogue log list
function renderChatMessages() {
    const container = document.getElementById('chat-msg-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const messages = chatHistories[currentAssistant];
    messages.forEach(msg => {
        const bubble = document.createElement('div');
        bubble.className = `chat-msg-bubble ${msg.role}`;
        bubble.innerText = msg.text;
        container.appendChild(bubble);
    });
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

// Handle dialogue limit display updates
function updateChatLimitDisplay() {
    const isMaster = currentUser && currentUser.tier === 'master';
    const chatLock = document.getElementById('chat-lock-cover');
    const countLbl = document.getElementById('chat-remaining-lbl');
    
    if (!chatLock || !countLbl) return;
    
    if (isMaster) {
        chatLock.style.display = 'none';
        countLbl.innerText = translations[currentLang].chat_limit_unlimited;
        countLbl.style.color = 'var(--gold)';
    } else {
        const chatCount = currentUser ? currentUser.chatCount || 0 : 0;
        const remaining = Math.max(0, 1 - chatCount);
        
        countLbl.innerText = `${translations[currentLang].chat_limit_remaining || 'Remaining: '}${remaining} ${currentLang === 'zh' ? '次' : 'times'}`;
        countLbl.style.color = '#888';
        
        if (remaining <= 0) {
            chatLock.style.display = 'flex';
        } else {
            chatLock.style.display = 'none';
        }
    }
}

// Send user message to AI consultancy backend
async function sendChatMessage() {
    if (!currentUser) return;
    
    // If chatCount limit is reached, prevent sending
    const isMaster = currentUser.tier === 'master';
    if (!isMaster && (currentUser.chatCount || 0) >= 1) {
        updateChatLimitDisplay();
        return;
    }
    
    const input = document.getElementById('chat-input');
    const messageText = input.value.trim();
    if (!messageText) return;
    
    // Append user message bubble to view
    chatHistories[currentAssistant].push({ role: 'user', text: messageText });
    renderChatMessages();
    input.value = '';
    
    // Render bot writing loading bubble placeholder
    const container = document.getElementById('chat-msg-container');
    const loadBubble = document.createElement('div');
    loadBubble.className = 'chat-msg-bubble bot loader-bubble';
    loadBubble.innerText = currentLang === 'zh' ? '正在开盘掐指推算中...' : 'Consulting the oracle...';
    container.appendChild(loadBubble);
    container.scrollTop = container.scrollHeight;
    
    try {
        const res = await fetch('/api/chat/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: currentUser.username,
                message: messageText,
                assistant: currentAssistant
            })
        });
        
        // Remove loader bubble
        loadBubble.remove();
        
        const data = await res.json();
        
        if (res.ok && data.success) {
            chatHistories[currentAssistant].push({ role: 'bot', text: data.reply });
            
            // Increment local user chat trial tracker
            if (!isMaster) {
                currentUser.chatCount = (currentUser.chatCount || 0) + 1;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
        } else {
            let errorText = currentLang === 'zh' ? '今日批卦额度已竭。' : 'Daily limit reached.';
            if (data.error === 'limit_reached') {
                errorText = translations[currentLang].chat_lock_desc;
            }
            chatHistories[currentAssistant].push({ role: 'bot', text: errorText });
        }
    } catch (err) {
        loadBubble.remove();
        chatHistories[currentAssistant].push({ role: 'bot', text: currentLang === 'zh' ? '天机受阻，无法推演。请稍后重试。' : 'Divine connection interrupted. Please try again later.' });
    }
    
    // Update view layout
    renderChatMessages();
    updateChatLimitDisplay();
}

function updateProfileUI() {
    if (!currentUser) return;
    document.getElementById('profile-val-username').innerText = currentUser.username;
    document.getElementById('profile-val-fullname').innerText = currentUser.fullname;
    
    const genderKey = currentUser.gender === 'male' ? 'profile_gender_male' : 'profile_gender_female';
    document.getElementById('profile-val-gender').innerText = translations[currentLang][genderKey] || currentUser.gender;
    
    const tobStr = currentUser.tob === 'unknown' 
        ? (currentLang === 'zh' ? '未知' : 'Unknown') 
        : (currentLang === 'zh' ? `${currentUser.tob}点` : `${currentUser.tob}:00`);
    document.getElementById('profile-val-birth').innerText = `${currentUser.dob} (${tobStr})`;
    
    const membershipKey = currentUser.tier === 'master' ? 'profile_membership_master' : 'profile_membership_free';
    document.getElementById('profile-membership-lbl').innerText = translations[currentLang][membershipKey];
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('currentLang', lang);
    
    // Update active class on buttons
    document.querySelectorAll('.lang-switcher .lang-btn').forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 1. Translate title & description
    if (translations[lang]) {
        document.title = translations[lang].title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', translations[lang].meta_desc);
        }
    }
    
    // 2. Translate all nodes with [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key] !== undefined) {
            el.innerText = translations[lang][key];
        }
    });
    
    // 3. Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
    
    // 4. Update DOB selectors placeholder option names
    initAllDOBSelectors();
    
    // 5. Update calendar weekday names
    renderCalendarWeek();
    
    // 6. Update Profile UI if logged in
    updateProfileUI();
    
    // 7. Update Daily Fortune UI if loaded
    if (currentDailyFortune) {
        renderDailyFortuneUI(currentDailyFortune);
    }
    
    // 8. Update active chat assistant greeting message
    // Translate default greetings in history
    if (chatHistories.astrology.length > 0 && chatHistories.astrology[0].role === 'bot' && 
        (chatHistories.astrology[0].text.startsWith('您好，我是您的测算童子') || chatHistories.astrology[0].text.startsWith('Hello, I am your Fortune Child'))) {
        chatHistories.astrology[0].text = lang === 'en' 
            ? 'Hello, I am your Fortune Child. Based on your Bazi chart, you can ask me questions about your career, education, relationship, or health.' 
            : '您好，我是您的测算童子。已根据您的八字排盘，您可以随时问我关于您的事业、学业、感情或健康问题。';
    }
    if (chatHistories.dasiming.length > 0 && chatHistories.dasiming[0].role === 'bot' && 
        (chatHistories.dasiming[0].text.startsWith('吾乃大司命') || chatHistories.dasiming[0].text.startsWith('I am Da Si Ming'))) {
        chatHistories.dasiming[0].text = lang === 'en' 
            ? 'I am Da Si Ming, governing the records of life, death, and fortune. Your chart is open; what do you seek?' 
            : '吾乃大司命，主掌世人寿夭与祸福。今开命局，汝有何求？';
    }
    renderChatMessages();
    updateAssistantDetailsUI();
    updateChatSuggestions();
    updateChatLimitDisplay();
    
    // 9. If we are on report view or annual book, re-render content
    if (currentUser) {
        if (activeTab === 'report') {
            loadDestinyReports();
            if (activeReportSection) {
                openReportModal(activeReportSection);
            }
        } else if (activeTab === 'fortune' && document.getElementById('btn-fortune-annual').classList.contains('active')) {
            loadAnnualBook();
        }
    }
}
