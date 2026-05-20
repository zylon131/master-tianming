// --- i18n Dictionary ---
const translations = {
    en: {
        nav_start: "Start Reading",
        hero_title: "Your Destiny, Decoded",
        hero_desc: "Unlock the secrets of your birth chart with 5,000 years of Chinese wisdom. Master TianMing provides profound insights through the Eight Characters (Bazi).",
        btn_discover: "Discover My Path",
        tier_essential: "Essential Insight",
        tier_deluxe: "Guardian's Path",
        tier_master: "Master's Revelation",
        zodiac_title: "Discover Your Animal Spirit",
        zodiac_desc: "Enter your birth date to instantly reveal your Chinese Zodiac sign and core personality traits—100% free.",
        btn_reveal_zodiac: "Reveal My Zodiac",
        zodiac_badge: "✦ FREE",
        btn_zodiac: "Free Zodiac Check",
        btn_back: "← Back to Home",
        reading_title: "Enter Your Details",
        reading_desc: "To map your destiny, we need the precise alignment of the stars at the moment of your birth.",
        label_name: "Full Name",
        label_gender: "Gender",
        label_dob: "Date of Birth",
        label_tob: "Time of Birth",
        btn_proceed: "Proceed to Revelation",
        processing_master: "Master TianMing is Consulting the Heavens...",
        processing_calculating: "Calculating Eight Characters and Five Elements...",
        report_title: "Your Destiny Revelation",
        report_subtitle: "A Private Report by Master TianMing",
        btn_download: "Download as PDF",
        shop_title: "The Sacred Collection",
        shop_desc: "Harmonize Your Energy based on your unique chart.",

        p1_name: "Harmonizer Bead",
        p2_name: "Zen Masterpiece",
        p3_name: "Guardian Totem",
        p4_name: "Imperial Legacy",
        p5_name: "Flame Cinnabar",
        reading_tier: "Reading Tier",
        stripe_notice: "Payment will be processed securely via Lemon Squeezy.",
        gender_m: "Male",
        gender_f: "Female",
        placeholder_name: "For the record of fate",
        opt_year: "Year",
        opt_month: "Month",
        opt_day: "Day",
        f1_e: "Bazi (8-Character) Chart",
        f2_e: "Five Elements Balance",
        f3_e: "Career & Wealth Outlook",
        f4_e: "Personalized Luck Tips",
        f1_d: "Everything in Essential",
        f2_d: "Relationship & Love Match",
        f3_d: "3-Year Detailed Forecast",
        f4_d: "Custom Lucky Bracelet (Free)",
        f1_m: "Personal Review by Master",
        f2_m: "Deep Lifetime Fate Analysis",
        f3_m: "5-Year Auspicious Calendar",
        f4_m: "Spiritual Ritual Advice",
        btn_buy_now: "Buy Now",
        dropship_desc: "Consecrated by the Master and dispatched securely from our sanctuary. Free delivery within 7-14 days.",
        label_phone: "Phone Number",
        label_address: "Shipping Address",
        order_success: "Purchase Successful!",
        order_success_desc: "Your payment has been completed. The talisman will be custom consecrated and dispatched securely.",
        delivery_est: "Estimated delivery: 7-14 business days. A tracking link will be sent to your email.",
        placeholder_phone: "+1 123 456 7890",
        placeholder_address: "Street Address, City, State, ZIP, Country",
        btn_pay: "Complete Payment"
    },
    zh: {
        nav_start: "开始测算",
        hero_title: "天命既定，一测便知",
        hero_desc: "解锁 5000 年东方智慧，天命大师通过八字命盘为您洞察事业、感情与财富天机。",
        btn_discover: "探索天命",
        p1_name: "调和灵珠",
        p2_name: "禅意杰作",
        p3_name: "守护图腾",
        p4_name: "皇家传承",
        p5_name: "烈焰朱砂",
        tier_essential: "精简排盘",
        tier_deluxe: "守护之径",
        tier_master: "大师亲测",
        zodiac_title: "免费生肖测算",
        zodiac_desc: "输入您的出生日期，立即揭晓您的专属生肖与核心性格特征——完全免费。",
        btn_reveal_zodiac: "立即揭晓",
        zodiac_badge: "✦ 免费",
        btn_zodiac: "免费测生肖",
        btn_back: "← 返回首页",
        reading_title: "输入您的信息",
        reading_desc: "为了准确描绘您的命运蓝图，我们需要您出生那一刻的星象排列。",
        label_name: "姓名",
        label_gender: "性别",
        label_dob: "出生日期",
        label_tob: "出生时辰",
        btn_proceed: "开启启示录",
        processing_master: "大师正在掐指一算...",
        processing_calculating: "正在排布八字与五行...",
        report_title: "天命启示录",
        report_subtitle: "天命大师私人亲测报告",
        btn_download: "下载 PDF 报告",
        shop_title: "圣藏系列",
        shop_desc: "根据您的命盘，调和您的能量场。",
        reading_tier: "测算档位",
        stripe_notice: "支付将通过 Lemon Squeezy 安全处理。",
        gender_m: "男",
        gender_f: "女",
        placeholder_name: "登记于天命册",
        opt_year: "年",
        opt_month: "月",
        opt_day: "日",
        f1_e: "八字排盘与格局",
        f2_e: "五行强弱与喜忌",
        f3_e: "近期事业与财运",
        f4_e: "日常开运小贴士",
        f1_d: "包含【精简排盘】所有特权",
        f2_d: "正缘桃花与婚姻羁绊",
        f3_d: "未来三年运势大势",
        f4_d: "定制五行转运手链 (免费)",
        f1_m: "大师逐字起草私密测算",
        f2_m: "终身大运起伏与前世业力",
        f3_m: "黄金五年吉凶宜忌预测",
        f4_m: "灵性层面的高级开运阵法",
        btn_buy_now: "立即结缘",
        dropship_desc: "由天命堂工坊专属手工定制，经大师亲自加持开光，7-14天免费安全寄达。",
        label_phone: "联系电话",
        label_address: "收货地址",
        order_success: "结缘成功！",
        order_success_desc: "您的付款已完成。法器将由天命大师亲自加持开光后，由官方物流专仓安全寄送给您。",
        delivery_est: "预计送达时间：7-14个工作日。物流跟踪链接将通过邮件及短信发送给您。",
        placeholder_phone: "您的收货联系电话，用于接收短信",
        placeholder_address: "详细的邮寄地址，例如：XX省XX市XX区XX街道XX号",
        btn_pay: "确认付款"
    }
};

let currentLang = localStorage.getItem('lang') || 'en';

// Helper to wait for global libraries
const waitForLib = () => {
    return new Promise(resolve => {
        const check = () => {
            if (window.Solar && window.Lunar) resolve();
            else setTimeout(check, 100);
        };
        check();
    });
};

document.addEventListener('DOMContentLoaded', async () => {
    await waitForLib();
    
    // 1. Language Initialization
    const langSwitch = document.getElementById('lang-switch');
    if (langSwitch) {
        const btns = langSwitch.querySelectorAll('.lang-btn');
        btns.forEach(btn => {
            if (btn.dataset.lang === currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
            
            btn.addEventListener('click', async () => {
                currentLang = btn.dataset.lang;
                localStorage.setItem('lang', currentLang);
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateLanguage();
                initPricing(); // Re-init pricing to refresh tier translation
                
                // If on report page, regenerate the report in the new language
                const container = document.getElementById('report-content');
                const readingStr = sessionStorage.getItem('current_reading');
                if (container && readingStr) {
                    container.innerHTML = `<div style="text-align:center; padding: 4rem; font-size: 1.2rem; color: var(--cinnabar);">${currentLang === 'zh' ? '正在为您重新凝结命运星象，请稍候...' : 'Consulting the heavens for your translated reading, please wait...'}</div>`;
                    const readingData = JSON.parse(readingStr);
                    try {
                        const urlParams = new URLSearchParams(window.location.search);
                        const checkoutId = urlParams.get('checkout_id') || readingData.checkout_id;
                        const orderId = urlParams.get('order_id') || readingData.order_id;
                        
                        let query = `lang=${currentLang}`;
                        if (checkoutId) query += `&checkout_id=${checkoutId}`;
                        if (orderId) query += `&order_id=${orderId}`;
                        
                        const response = await fetch(`/api/get-reading?${query}`);
                        if (!response.ok) throw new Error("Failed to load reading.");
                        const resData = await response.json();
                        
                        readingData.report = resData.report;
                        sessionStorage.setItem('current_reading', JSON.stringify({
                            ...readingData,
                            checkout_id: checkoutId,
                            order_id: orderId
                        }));
                        renderReport(readingData);
                    } catch (err) {
                        console.error(err);
                        container.innerHTML = `<div style="text-align:center; padding: 4rem; color: var(--cinnabar);">${currentLang === 'zh' ? '获取翻译报告失败，请稍后重试。' : 'Failed to retrieve translated report. Please try again.'}</div>`;
                    }
                }
            });
        });
    }
    updateLanguage();

    // 2. Pricing & Tier Display (Reading Page)
    initPricing();

    // 2.5 DOB Dropdowns Logic
    const yearSelect = document.getElementById('dob-year');
    const monthSelect = document.getElementById('dob-month');
    const daySelect = document.getElementById('dob-day');
    
    if (yearSelect && monthSelect && daySelect) {
        const currentYear = new Date().getFullYear();
        
        // Populate Years (1920 - current year)
        yearSelect.innerHTML = `<option value="" class="i18n" data-key="opt_year" disabled selected>${translations[currentLang].opt_year || 'Year'}</option>`;
        for (let i = currentYear; i >= 1920; i--) {
            yearSelect.innerHTML += `<option value="${i}">${i}</option>`;
        }

        // Populate Months (1 - 12)
        monthSelect.innerHTML = `<option value="" class="i18n" data-key="opt_month" disabled selected>${translations[currentLang].opt_month || 'Month'}</option>`;
        for (let i = 1; i <= 12; i++) {
            const v = i < 10 ? '0' + i : i;
            monthSelect.innerHTML += `<option value="${v}">${i}</option>`;
        }

        // Dynamic Days logic
        const updateDays = () => {
            const y = parseInt(yearSelect.value);
            const m = parseInt(monthSelect.value);
            let daysInMonth = 31;
            
            if (!isNaN(m)) {
                if (m === 2) {
                    daysInMonth = (!isNaN(y) && y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? 29 : 28;
                } else if ([4, 6, 9, 11].includes(m)) {
                    daysInMonth = 30;
                }
            }
            
            const currentDay = daySelect.value;
            daySelect.innerHTML = `<option value="" class="i18n" data-key="opt_day" disabled selected>${translations[currentLang].opt_day || 'Day'}</option>`;
            for (let i = 1; i <= daysInMonth; i++) {
                const v = i < 10 ? '0' + i : i;
                const selected = v === currentDay ? 'selected' : '';
                daySelect.innerHTML += `<option value="${v}" ${selected}>${i}</option>`;
            }
        };

        yearSelect.addEventListener('change', updateDays);
        monthSelect.addEventListener('change', updateDays);
        updateDays();
    }

    // 3. Free Zodiac Check
    const zodiacForm = document.getElementById('zodiac-form');
    if (zodiacForm) {
        const zYearSelect = document.getElementById('zodiac-dob-year');
        const zMonthSelect = document.getElementById('zodiac-dob-month');
        const zDaySelect = document.getElementById('zodiac-dob-day');
        
        if (zYearSelect && zMonthSelect && zDaySelect) {
            zYearSelect.innerHTML = `<option value="" class="i18n" data-key="opt_year" disabled selected>${translations[currentLang].opt_year || 'Year'}</option>`;
            const currentYear = new Date().getFullYear();
            for (let y = currentYear; y >= 1920; y--) {
                zYearSelect.innerHTML += `<option value="${y}">${y}</option>`;
            }

            zMonthSelect.innerHTML = `<option value="" class="i18n" data-key="opt_month" disabled selected>${translations[currentLang].opt_month || 'Month'}</option>`;
            for (let i = 1; i <= 12; i++) {
                const v = i < 10 ? '0' + i : i;
                zMonthSelect.innerHTML += `<option value="${v}">${i}</option>`;
            }

            const updateZodiacDays = () => {
                const y = parseInt(zYearSelect.value);
                const m = parseInt(zMonthSelect.value);
                let daysInMonth = 31;
                
                if (!isNaN(m)) {
                    if (m === 2) {
                        daysInMonth = (!isNaN(y) && y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? 29 : 28;
                    } else if ([4, 6, 9, 11].includes(m)) {
                        daysInMonth = 30;
                    }
                }
                
                const currentDay = zDaySelect.value;
                zDaySelect.innerHTML = `<option value="" class="i18n" data-key="opt_day" disabled selected>${translations[currentLang].opt_day || 'Day'}</option>`;
                for (let i = 1; i <= daysInMonth; i++) {
                    const v = i < 10 ? '0' + i : i;
                    const selected = v === currentDay ? 'selected' : '';
                    zDaySelect.innerHTML += `<option value="${v}" ${selected}>${i}</option>`;
                }
            };

            zYearSelect.addEventListener('change', updateZodiacDays);
            zMonthSelect.addEventListener('change', updateZodiacDays);
            updateZodiacDays();
        }

        const zodiacDB = {
            '鼠': { en: 'Rat', icon: '🐭', desc: 'Quick-witted, resourceful, and versatile. You have strong intuition and adapt quickly to new environments.', desc_zh: '机智灵活，适应力强。直觉敏锐，总是能在新环境中迅速找到属于自己的位置。' },
            '牛': { en: 'Ox', icon: '🐮', desc: 'Diligent, dependable, and determined. You achieve your goals through hard work and persistence.', desc_zh: '勤恳踏实，责任心极强。凭借着不屈不挠的毅力和汗水，稳步实现人生目标。' },
            '虎': { en: 'Tiger', icon: '🐯', desc: 'Brave, confident, and competitive. You are a natural leader who loves a good challenge.', desc_zh: '勇敢自信，天生具有领导力。不畏艰难险阻，越是充满挑战的环境越能激发潜能。' },
            '兔': { en: 'Rabbit', icon: '🐰', desc: 'Quiet, elegant, and responsible. You seek harmony and treat everyone with kindness.', desc_zh: '温和平静，优雅从容。心思细腻，总是以温柔和善意对待身边的每一个人。' },
            '龙': { en: 'Dragon', icon: '🐲', desc: 'Confident, intelligent, and enthusiastic. You are fearless and strive for excellence.', desc_zh: '气场强大，才华横溢。充满热情与魄力，一生追求卓越，不甘平庸。' },
            '蛇': { en: 'Snake', icon: '🐍', desc: 'Enigmatic, intelligent, and wise. You rely on your sharp intuition and stay calm under pressure.', desc_zh: '神秘深邃，智慧过人。第六感极强，总能在关键时刻保持极致的冷静。' },
            '马': { en: 'Horse', icon: '🐴', desc: 'Animated, active, and energetic. You love freedom, travel, and being in the spotlight.', desc_zh: '热情奔放，热爱自由。精力充沛，喜欢在无拘无束的旷野中尽情驰骋。' },
            '羊': { en: 'Goat', icon: '🐏', desc: 'Calm, gentle, and sympathetic. You have a strong sense of artistry and love a peaceful life.', desc_zh: '温婉柔和，充满同情心。极具艺术天赋，内心向往宁静安定的生活。' },
            '猴': { en: 'Monkey', icon: '🐵', desc: 'Sharp, smart, and curious. You are a quick learner with a magnetic personality.', desc_zh: '聪明伶俐，好奇心旺盛。学习能力超强，幽默风趣，是团队中的开心果。' },
            '鸡': { en: 'Rooster', icon: '🐔', desc: 'Observant, hardworking, and courageous. You are always active and enjoy being the center of attention.', desc_zh: '洞察力强，果敢坚毅。做事井井有条，对自己要求严格，追求尽善尽美。' },
            '狗': { en: 'Dog', icon: '🐶', desc: 'Loyal, honest, and amiable. You have a profound sense of justice and are a true friend.', desc_zh: '忠诚可靠，重情重义。正义感极强，是身边人最值得信赖的挚友。' },
            '猪': { en: 'Pig', icon: '🐷', desc: 'Compassionate, generous, and diligent. You have a pure heart and seek to help others.', desc_zh: '宽厚包容，善良真诚。懂得享受生活，心胸开阔，福报深厚。' }
        };

        zodiacForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const zYear = document.getElementById('zodiac-dob-year')?.value;
            const zMonth = document.getElementById('zodiac-dob-month')?.value;
            const zDay = document.getElementById('zodiac-dob-day')?.value;
            const resultDiv = document.getElementById('zodiac-result');
            
            if (zYear && zMonth && zDay && resultDiv && window.Solar) {
                const year = parseInt(zYear);
                const month = parseInt(zMonth);
                const day = parseInt(zDay);
                const solar = window.Solar.fromYmd(year, month, day);
                const lunar = solar.getLunar();
                const animal = lunar.getYearShengXiao();
                
                const data = zodiacDB[animal];
                if (data) {
                    const name = currentLang === 'en' ? data.en : animal;
                    const desc = currentLang === 'en' ? data.desc : data.desc_zh;
                    const ctaText = currentLang === 'en' ? 'Want deeper insights? Get your full Bazi Reading.' : '想知道更多？获取完整八字命理推演。';
                    
                    resultDiv.style.display = 'block';
                    resultDiv.innerHTML = `
                        <div style="font-size: 5rem; margin-bottom: 1rem; animation: bounce 2s infinite;">${data.icon}</div>
                        <h3 style="font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 0.8rem; color: var(--gold);">${name}</h3>
                        <p style="font-size: 1.1rem; line-height: 1.7; margin-bottom: 2.5rem; color: #444;">${desc}</p>
                        <a href="#readings" class="btn btn-secondary" style="border-color: var(--cinnabar); color: var(--cinnabar); font-weight: 600; padding: 1rem 2rem; border-radius: 50px;">${ctaText}</a>
                    `;
                    
                    // Add smooth scroll behavior for the dynamically injected link
                    const ctaLink = resultDiv.querySelector('a');
                    if(ctaLink) {
                        ctaLink.addEventListener('click', (ev) => {
                            ev.preventDefault();
                            document.querySelector('#readings').scrollIntoView({ behavior: 'smooth' });
                        });
                    }
                }
            }
        });
    }


    // 4. Form Submission
    const readingForm = document.getElementById('reading-form');
    if (readingForm) {
        readingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Combine DOB dropdowns
            const ySelect = document.getElementById('dob-year');
            const mSelect = document.getElementById('dob-month');
            const dSelect = document.getElementById('dob-day');
            if (ySelect && mSelect && dSelect) {
                document.getElementById('dob-hidden').value = `${ySelect.value}-${mSelect.value}-${dSelect.value}`;
            }

            const formData = new FormData(readingForm);
            const data = Object.fromEntries(formData.entries());
            const params = new URLSearchParams(window.location.search);
            const tier = params.get('tier') || sessionStorage.getItem('selected_tier') || 'essential';
            
            const overlay = document.getElementById('processing');
            if (overlay) overlay.style.display = 'flex';

            try {
                // Request checkout session from secure backend
                const response = await fetch('/api/create-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullname: data.fullname,
                        gender: data.gender,
                        dob: data.dob,
                        tob: data.tob,
                        tier: tier
                    })
                });

                if (!response.ok) throw new Error("Failed to create checkout.");
                const resData = await response.json();
                
                // Redirect user to Lemon Squeezy (or mock testing success url)
                setTimeout(() => window.location.href = resData.url, 1000);
            } catch (error) {
                alert(currentLang === 'zh' ? "与服务器通信失败，请稍后再试。" : "Communication with server failed. Please try again later.");
                if (overlay) overlay.style.display = 'none';
            }
        });
    }

    // 5. Report Page (check DOM instead of URL pathname for environments that strip .html)
    const reportContainer = document.getElementById('report-content');
    if (reportContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const checkoutId = urlParams.get('checkout_id');
        const orderId = urlParams.get('order_id');

        if (checkoutId || orderId) {
            loadReadingFromBackend(checkoutId, orderId);
        } else {
            const data = JSON.parse(sessionStorage.getItem('current_reading'));
            if (!data) {
                window.location.href = 'index.html';
            } else {
                renderReport(data);
            }
        }
    }
    // 6. Tier Selection Fallback (Index Page)
    const priceBtns = document.querySelectorAll('.price-card .btn');
    priceBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if (href && href.includes('tier=')) {
                const selectedTier = href.split('tier=')[1];
                sessionStorage.setItem('selected_tier', selectedTier);
            }
        });
    });

    // 7. Direct Talisman Checkout Modal Logic
    const buyNowBtns = document.querySelectorAll('.btn-buy-now');
    const talismanModal = document.getElementById('talisman-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalDoneBtn = document.getElementById('modal-done-btn');
    const modalCheckoutForm = document.getElementById('modal-checkout-form');
    const modalSuccess = document.getElementById('modal-success');

    if (talismanModal && buyNowBtns.length > 0) {
        let activeProduct = '';
        let activePrice = '';
        let activeProductName = '';

        buyNowBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                activeProduct = btn.dataset.product;
                activePrice = btn.dataset.price;
                activeProductName = currentLang === 'zh' ? btn.dataset.nameZh : btn.dataset.nameEn;
                const imgUrl = btn.dataset.img;

                // Update modal details
                document.getElementById('modal-title').innerText = currentLang === 'zh' ? '结缘开运法器' : 'Talisman Checkout';
                document.getElementById('modal-price').innerText = activePrice + ' USD';
                document.getElementById('modal-img').src = imgUrl;
                document.getElementById('modal-product-name').innerText = activeProductName;

                // Reset form and views
                modalCheckoutForm.reset();
                modalCheckoutForm.style.display = 'block';
                modalSuccess.style.display = 'none';
                document.getElementById('modal-error').style.display = 'none';
                talismanModal.style.display = 'flex';
            });
        });

        // Close modal handlers
        const closeModal = () => {
            talismanModal.style.display = 'none';
        };
        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
        if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => {
            if (e.target === talismanModal) closeModal();
        });

        // Submit form handler
        if (modalCheckoutForm) {
            modalCheckoutForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const submitBtn = document.getElementById('modal-submit-btn');
                const origText = submitBtn.innerText;
                submitBtn.innerText = currentLang === 'zh' ? '正在处理付款...' : 'Processing Payment...';
                submitBtn.disabled = true;

                const orderId = 'MTM-' + Math.floor(Math.random() * 90000000 + 10000000);
                const fullName = document.getElementById('modal-fullname').value;
                const email = document.getElementById('modal-email').value;
                const phoneNumber = document.getElementById('modal-phone').value;
                const shippingAddress = document.getElementById('modal-address').value;

                try {
                    const response = await fetch('/api/buy-talisman', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            orderId,
                            lackingElement: activeProduct,
                            talismanName: activeProductName,
                            price: activePrice,
                            fullName,
                            email,
                            shippingAddress,
                            phoneNumber
                        })
                    });

                    if (!response.ok) throw new Error("Fulfillment failed.");

                    // Show success
                    document.getElementById('modal-tracking-id').innerText = `${currentLang === 'zh' ? '订单号' : 'Order ID'}: ${orderId}`;
                    modalCheckoutForm.style.display = 'none';
                    modalSuccess.style.display = 'block';
                } catch (err) {
                    const errDiv = document.getElementById('modal-error');
                    errDiv.innerText = currentLang === 'zh' ? '付款失败，请重试。' : 'Payment failed, please try again.';
                    errDiv.style.display = 'block';
                } finally {
                    submitBtn.innerText = origText;
                    submitBtn.disabled = false;
                }
            });
        }
    }
});

function initPricing() {
    const params = new URLSearchParams(window.location.search);
    let tier = params.get('tier');
    
    // Fallback to sessionStorage if URL params are missing (common in local file:// execution)
    if (!tier) {
        tier = sessionStorage.getItem('selected_tier') || 'essential';
    } else {
        sessionStorage.setItem('selected_tier', tier);
    }

    const tierDisplay = document.getElementById('tier-display');
    const tierPrice = document.getElementById('tier-price');

    if (tierDisplay && tierPrice) {
        const tierName = translations[currentLang][`tier_${tier}`] || translations[currentLang].tier_essential;
        tierDisplay.innerText = tierName;
        
        if (tier === 'master') {
            tierPrice.innerText = "$299.00";
            tierPrice.style.color = "#d4af37";
        } else if (tier === 'deluxe') {
            tierPrice.innerText = "$129.00";
            tierPrice.style.color = "var(--cinnabar)";
        } else {
            tierPrice.innerText = "$19.00";
            tierPrice.style.color = "var(--cinnabar)";
        }
    }
}

function updateLanguage() {
    document.querySelectorAll('.i18n').forEach(el => {
        const key = el.dataset.key;
        if (translations[currentLang][key]) {
            if (el.tagName === 'INPUT') el.placeholder = translations[currentLang][key];
            else el.innerText = translations[currentLang][key];
        }
    });
    document.querySelectorAll('label[data-key]').forEach(el => {
        el.innerText = translations[currentLang][el.dataset.key];
    });
}

function calculateBazi(dob, tob) {
    const { Solar } = window;
    const date = new Date(dob);
    const hour = tob === 'unknown' ? 12 : parseInt(tob);
    const solar = Solar.fromYmdHms(date.getFullYear(), date.getMonth() + 1, date.getDate(), hour, 0, 0);
    const lunar = solar.getLunar();
    return {
        pillars: lunar.getBaZi(),
        elements: lunar.getBaZiWuXing(),
        dayMasterElement: lunar.getBaZiWuXing()[2][0]
    };
}

async function loadReadingFromBackend(checkoutId, orderId) {
    const container = document.getElementById('report-content');
    if (!container) return;
    
    container.innerHTML = `
        <div style="text-align: center; padding: 4rem;">
            <p style="font-size: 1.2rem; color: var(--cinnabar); font-weight: bold; animation: pulse 2.5s infinite;">
                ${currentLang === 'zh' ? '正在与天界核对缘分，解析您的命理玄机...' : 'Verifying your token and decoding the stars...'}
            </p>
        </div>
    `;

    try {
        let query = `lang=${currentLang}`;
        if (checkoutId) query += `&checkout_id=${checkoutId}`;
        if (orderId) query += `&order_id=${orderId}`;

        const response = await fetch(`/api/get-reading?${query}`);
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Unpaid or invalid session.");
        }

        const resData = await response.json();
        
        // Save to session storage
        sessionStorage.setItem('current_reading', JSON.stringify({
            user: resData.user,
            bazi: resData.bazi,
            report: resData.report,
            tier: resData.tier,
            checkout_id: checkoutId,
            order_id: orderId
        }));

        renderReport(resData);
    } catch (error) {
        console.error("Load Reading Error:", error);
        container.innerHTML = `
            <div style="text-align: center; padding: 4rem; border: 1px solid var(--cinnabar); background: rgba(178,34,34,0.05); border-radius: 8px;">
                <h3 style="color: var(--cinnabar); font-family: var(--font-serif); font-size: 1.8rem; margin-bottom: 1rem;">
                    ${currentLang === 'zh' ? '命运星象未能显现' : 'The Stars Are Obscured'}
                </h3>
                <p style="margin-bottom: 2rem;">
                    ${currentLang === 'zh' 
                        ? (error.message.includes("Payment") ? '测算尚未完成支付，请确认您的订单状态。' : '支付校验成功但获取报告失败，请稍后刷新重试或联系客服。')
                        : (error.message.includes("Payment") ? 'Payment verification is pending. Please complete checkout.' : 'Failed to retrieve your reading. Please refresh or contact support.')
                    }
                </p>
                <a href="index.html" class="btn btn-secondary" style="display: inline-block; width: auto; padding: 0.8rem 2rem;">
                    ${currentLang === 'zh' ? '返回首页' : 'Return to Home'}
                </a>
            </div>
        `;
    }
}

function renderReport(data) {
    const container = document.getElementById('report-content');
    if (!container) return;
    container.innerHTML = `
        <div class="report-section">
            <div class="bazi-grid">
                ${data.bazi.pillars.map((p, i) => `
                    <div class="bazi-cell">
                        <div class="bazi-char">${p}</div>
                        <div class="bazi-en">${data.bazi.elements[i]}</div>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 2rem; line-height: 1.8;">${data.report}</div>
        </div>
    `;

    // 1688 Five Elements Product Attribute Management
    const productsDB = {
        '金': {
            image: 'talisman_metal.png',
            price: '$39.00 USD / ¥268.00',
            en: { name: "White Gold Obsidian Bracelet", desc: "Forged with Metal energy to enhance decision-making, ground your spirit, and attract elite wealth." },
            zh: { name: "白金黑曜石本命手链", desc: "蕴含纯正金气，助您决断果敢，招财纳福，破除事业迷雾，辟邪消灾。" }
        },
        '木': {
            image: 'talisman_wood.png',
            price: '$39.00 USD / ¥268.00',
            en: { name: "Green Sandalwood Zen Beads", desc: "Nourished with Wood energy to promote healing, peace of mind, and academic/career growth." },
            zh: { name: "绿檀木禅意佛珠手串", desc: "木气生发，养神静心，助旺文昌，调和身心平衡，助事业节节高升。" }
        },
        '水': {
            image: 'talisman_water.png',
            price: '$39.00 USD / ¥268.00',
            en: { name: "Deep Sea Aquamarine Talisman", desc: "Flowing with Water energy to bring serene wisdom, calm emotions, and smooth out yearly clashes." },
            zh: { name: "深海海蓝宝开运护符", desc: "水气润泽，化解焦虑与急躁，增强沟通与智慧，柔化本命流年煞气。" }
        },
        '火': {
            image: 'talisman_fire.png',
            price: '$39.00 USD / ¥268.00',
            en: { name: "Crimson Agate Amulet", desc: "Blazing with Fire energy to boost vitality, ignite passion, and expand noble connections." },
            zh: { name: "赤焰南红玛瑙吉化手串", desc: "火气升腾，激发无尽热情与生命力，助旺正桃花、贵人缘与名气。" }
        },
        '土': {
            image: 'talisman_earth.png',
            price: '$39.00 USD / ¥268.00',
            en: { name: "Yellow Citrine Prosperity Sphere", desc: "Grounded with Earth energy to provide solid stability, family peace, and strong wealth retention." },
            zh: { name: "黄水晶聚宝招财手链", desc: "厚土承载，稳固运势根基，极强吸金聚财，让您的事业与家庭稳如泰山。" }
        }
    };

    const elementCounts = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
    data.bazi.elements.forEach(pillar => {
        for (let i = 0; i < pillar.length; i++) {
            if (elementCounts[pillar[i]] !== undefined) {
                elementCounts[pillar[i]]++;
            }
        }
    });

    let lackingElement = '金';
    let minCount = 99;
    for (let el in elementCounts) {
        if (elementCounts[el] < minCount) {
            minCount = elementCounts[el];
            lackingElement = el;
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const checkoutId = urlParams.get('checkout_id') || '';
    const orderId = urlParams.get('order_id') || '';

    const recContainer = document.getElementById('recommended-products');
    if (recContainer) {
        const productInfo = productsDB[lackingElement][currentLang === 'zh' ? 'zh' : 'en'];
        const productImg = productsDB[lackingElement].image;
        const labelNeeded = currentLang === 'zh' ? `五行缺${lackingElement}专属调和法器` : `Needs ${lackingElement} Energy Support`;
        
        recContainer.innerHTML = `
            <div class="talisman-card" style="display: flex; flex-direction: row; flex-wrap: wrap; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; overflow: hidden; max-width: 800px; margin: 0 auto; text-align: left; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <div style="flex: 1; min-width: 250px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.2); padding: 2rem;">
                    <img src="${productImg}" alt="${productInfo.name}" style="max-width: 220px; border-radius: 8px; box-shadow: 0 5px 15px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05);">
                </div>
                <div style="flex: 1.5; min-width: 280px; padding: 2.5rem; display: flex; flex-direction: column; justify-content: center;">
                    <div style="font-size: 0.8rem; color: var(--gold); margin-bottom: 0.5rem; font-weight: bold; letter-spacing: 2px;">[ ${labelNeeded} ]</div>
                    <h4 style="font-family: var(--font-serif); font-size: 1.8rem; margin: 0 0 1rem 0; color: #fff; line-height: 1.2;">${productInfo.name}</h4>
                    <div style="font-size: 1.4rem; color: var(--gold); font-weight: 700; margin-bottom: 1.5rem;">$39.00 USD <span style="font-size: 0.9rem; opacity: 0.6; font-weight: 400; margin-left: 0.5rem;">(¥268.00 CNY)</span></div>
                    <p style="font-size: 0.95rem; opacity: 0.85; margin-bottom: 2rem; line-height: 1.6;">${productInfo.desc}</p>
                    
                    <button id="btn-show-checkout" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1rem; width: auto; align-self: flex-start; cursor: pointer;">
                        ${currentLang === 'zh' ? '立即结缘' : 'Claim Your Talisman'}
                    </button>

                    <div id="talisman-checkout-form" style="display: none; margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem;">
                        <h5 style="color: #fff; font-size: 1.1rem; margin: 0 0 1.5rem 0; font-family: var(--font-serif);">${currentLang === 'zh' ? '填写收货信息' : 'Enter Shipping Details'}</h5>
                        <div style="display: grid; grid-template-columns: 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                            <input type="text" id="talisman-ship-name" placeholder="${currentLang === 'zh' ? '收件人姓名' : 'Full Name'}" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); padding: 0.8rem; border-radius: 4px; color: #fff; width: 100%; box-sizing: border-box;">
                            <input type="email" id="talisman-ship-email" placeholder="${currentLang === 'zh' ? '电子邮箱' : 'Email Address'}" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); padding: 0.8rem; border-radius: 4px; color: #fff; width: 100%; box-sizing: border-box;">
                            <input type="text" id="talisman-ship-phone" placeholder="${currentLang === 'zh' ? '联系电话' : 'Phone Number'}" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); padding: 0.8rem; border-radius: 4px; color: #fff; width: 100%; box-sizing: border-box;">
                            <input type="text" id="talisman-ship-address" placeholder="${currentLang === 'zh' ? '详细收货地址 (省市区街道门牌号)' : 'Shipping Address (Street, City, Zip)'}" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); padding: 0.8rem; border-radius: 4px; color: #fff; width: 100%; box-sizing: border-box;">
                        </div>
                        <div id="talisman-error-msg" style="color: #ff5b5b; font-size: 0.9rem; margin-bottom: 1rem; display: none;"></div>
                        <button id="btn-submit-talisman" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1rem; width: 100%;">${currentLang === 'zh' ? '确认付款并安全结缘' : 'Confirm Payment & Order'}</button>
                    </div>

                    <div id="talisman-success-msg" style="display: none; margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; color: #00ff88; text-align: center;">
                        <h5 style="font-size: 1.3rem; margin: 0 0 0.5rem 0; font-family: var(--font-serif);">${currentLang === 'zh' ? '结缘成功！' : 'Sacred Order Confirmed!'}</h5>
                        <p style="font-size: 0.95rem; opacity: 0.9; margin: 0 0 1rem 0; line-height: 1.6;" id="talisman-success-text"></p>
                        <div style="font-size: 0.8rem; opacity: 0.6; padding: 0.5rem; background: rgba(0,0,0,0.2); border-radius: 4px;" id="talisman-tracking-text"></div>
                    </div>
                </div>
            </div>
        `;

        const showBtn = document.getElementById('btn-show-checkout');
        const formDiv = document.getElementById('talisman-checkout-form');
        const submitBtn = document.getElementById('btn-submit-talisman');
        const errorMsg = document.getElementById('talisman-error-msg');
        const successDiv = document.getElementById('talisman-success-msg');

        showBtn.addEventListener('click', (e) => {
            e.preventDefault();
            formDiv.style.display = 'block';
            showBtn.style.display = 'none';
        });

        submitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const fullName = document.getElementById('talisman-ship-name').value.trim();
            const email = document.getElementById('talisman-ship-email').value.trim();
            const phoneNumber = document.getElementById('talisman-ship-phone').value.trim();
            const shippingAddress = document.getElementById('talisman-ship-address').value.trim();

            if (!fullName || !email || !phoneNumber || !shippingAddress) {
                errorMsg.textContent = currentLang === 'zh' ? '请填写所有收货信息' : 'Please fill in all shipping details';
                errorMsg.style.display = 'block';
                return;
            }
            errorMsg.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.textContent = currentLang === 'zh' ? '处理付款中...' : 'Processing Payment...';

            try {
                const response = await fetch('/api/buy-talisman', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId: checkoutId || orderId || 'stateless',
                        lackingElement,
                        talismanName: productInfo.name,
                        price: '$39.00 USD',
                        fullName,
                        email,
                        shippingAddress,
                        phoneNumber
                    })
                });

                const resData = await response.json();
                if (resData.success) {
                    formDiv.style.display = 'none';
                    successDiv.style.display = 'block';
                    
                    const successText = currentLang === 'zh' 
                        ? `感谢您的信任。您的法器订单已建立（单号：${resData.orderId}）。天命大师将为您亲自加持并开光，我们将在24小时内通过官方国际物流直邮发货，您的五行磁场即将得到调和与圆满。`
                        : `Thank you for your trust. Your talisman order (${resData.orderId}) has been successfully created. Master TianMing will personally consecrate it, and it will be dispatched within 24 hours via official logistics.`;
                    
                    const trackingText = currentLang === 'zh'
                        ? `物流运单号：${resData.trackingId} (官方物流配送)`
                        : `Logistic Tracking ID: ${resData.trackingId} (Official Delivery)`;
                    
                    document.getElementById('talisman-success-text').textContent = successText;
                    document.getElementById('talisman-tracking-text').textContent = trackingText;
                } else {
                    errorMsg.textContent = resData.error || 'Failed to process checkout.';
                    errorMsg.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.textContent = currentLang === 'zh' ? '确认付款并安全结缘' : 'Confirm Payment & Order';
                }
            } catch (err) {
                console.error("Buy talisman fetch error:", err);
                errorMsg.textContent = currentLang === 'zh' ? '网络请求失败，请稍后重试' : 'Network error. Please try again.';
                errorMsg.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = currentLang === 'zh' ? '确认付款并安全结缘' : 'Confirm Payment & Order';
            }
        });
    }
}
