// Configuration
const DEEPSEEK_API_KEY = 'sk-9a969f6e9ebe4328a21b077dc237b905';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

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
        reading_tier: "Reading Tier",
        stripe_notice: "Payment will be processed securely via Stripe.",
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
        f4_m: "Spiritual Ritual Advice"
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
        stripe_notice: "支付将通过 Stripe 安全处理。",
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
        f4_m: "灵性层面的高级开运阵法"
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
                    const tier = readingData.tier || sessionStorage.getItem('selected_tier') || 'essential';
                    
                    // We can't await inside the click listener synchronously, but the function is async, so it's fine.
                    const newReport = await generateDestinyReport(readingData.user, readingData.bazi, tier);
                    readingData.report = newReport;
                    sessionStorage.setItem('current_reading', JSON.stringify(readingData));
                    renderReport(readingData);
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
                const baziData = calculateBazi(data.dob, data.tob);
                const report = await generateDestinyReport(data, baziData, tier);
                sessionStorage.setItem('current_reading', JSON.stringify({ user: data, bazi: baziData, report, tier }));
                setTimeout(() => window.location.href = 'report.html', 1500);
            } catch (error) {
                alert("Cloudy heavens. Try again later.");
                if (overlay) overlay.style.display = 'none';
            }
        });
    }

    // 5. Report Page (check DOM instead of URL pathname for environments that strip .html)
    const reportContainer = document.getElementById('report-content');
    if (reportContainer) {
        const data = JSON.parse(sessionStorage.getItem('current_reading'));
        if (!data) {
            window.location.href = 'index.html';
        } else {
            renderReport(data);
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

async function generateDestinyReport(userData, baziData, tier) {
    const lang = currentLang === 'zh' ? '中文' : 'English';
    const systemPrompt = currentLang === 'zh' 
        ? `你现在是"天命大师 (Master TianMing)"，一位精通《渊海子平》和《滴天髓》的易学宗师。你擅长用兼具东方哲学与现代人能理解的优美、神秘的文字来解析八字。请直接输出排版精美的HTML内容（仅使用 h3, p, strong, ul, li 标签），不要使用类似"作为AI..."的套话。`
        : `You are "Master TianMing", a Grandmaster of Eastern Metaphysics, Four Pillars of Destiny (Bazi), and I Ching. You analyze destinies with profound mystical Eastern philosophy combined with modern understanding. Output beautifully formatted HTML using ONLY h3, p, strong, ul, li tags. Do not break character or use generic AI phrases.`;

    let tierInstructions = '';
    if (tier === 'essential') {
        tierInstructions = currentLang === 'zh' ? `
            【精简排盘 ($19)】
            请根据以下大纲生成命理报告：
            1. 八字原局简析：解读命主的日主和五行格局。
            2. 五行强弱：指出命局中偏旺和缺失的五行。
            3. 事业财运简析：近期在工作和财富上的机遇与挑战。
            4. 开运小贴士：简单的日常风水或颜色建议。
            字数控制在400字左右。
        ` : `
            [Essential Insight ($19)]
            Provide a report based strictly on these topics:
            1. Bazi Chart Overview: Explain the Day Master and general chart structure.
            2. Five Elements Balance: Point out strong and missing elements.
            3. Career & Wealth Outlook: Opportunities and challenges in the near future.
            4. Personalized Luck Tips: Simple daily feng shui or color recommendations.
            Keep it concise, around 400 words.
        `;
    } else if (tier === 'deluxe') {
        tierInstructions = currentLang === 'zh' ? `
            【守护之径 ($129)】
            请根据以下大纲生成深度命理报告：
            1. 包含【精简排盘】的所有内容（原局、五行、事业财运）。
            2. 姻缘与桃花推演：分析命中桃花、婚姻宫的状态及正缘出现时机。
            3. 未来三年运势详批：逐年分析接下来三年的流年大势。
            4. 专属五行手链推荐：根据五行喜忌，推荐佩戴什么材质/颜色的手链来调和能量。
            字数控制在800字左右。
        ` : `
            [Guardian's Path ($129)]
            Provide an in-depth report based strictly on these topics:
            1. All Essential topics (Bazi overview, Elements, Career/Wealth).
            2. Relationship & Love Match: Analyze the marriage palace, peach blossom luck, and timing of true love.
            3. 3-Year Detailed Forecast: Year-by-year analysis for the next 3 years.
            4. Custom Lucky Bracelet Recommendation: Suggest specific materials/colors for a bracelet to balance their elements.
            Keep it detailed, around 800 words.
        `;
    } else {
        tierInstructions = currentLang === 'zh' ? `
            【大师私测 ($299)】
            请根据以下大纲生成极具深度的宗师级命理报告，语气要极具穿透力，仿佛亲自对案点拨：
            1. 终身大运详批：深度剖析原局格局、用神忌神，以及每十年一步的大运走势。
            2. 姻缘与桃花深度解析：命中情感羁绊与前世业力。
            3. 黄金五年起伏与宜忌预测：详细预测未来五年的吉凶转折点。
            4. 灵性层面的开运阵法与仪式：提供高级的风水布局、特定的冥想建议或仪式指导，帮助命主突破人生瓶颈。
            字数在1200字以上，内容详实。
        ` : `
            [Master's Revelation ($299)]
            Provide a profound, grandmaster-level reading with piercing insight, as if speaking directly to the client:
            1. Deep Lifetime Fate Analysis: Analyze the core chart structure, favorable/unfavorable elements, and 10-year luck pillars.
            2. Relationship Karma: Deep dive into romantic destiny and karmic ties.
            3. 5-Year Auspicious Calendar: Detailed forecast of the next 5 years, highlighting critical turning points and specific dos/don'ts.
            4. Spiritual Ritual Advice: Advanced Feng Shui layouts, meditation practices, or rituals to break through life bottlenecks.
            Make it extensive and profound, over 1200 words.
        `;
    }

    const genderStr = currentLang === 'zh' 
        ? (userData.gender === 'male' ? '男 (乾造)' : '女 (坤造)')
        : (userData.gender === 'male' ? 'Male' : 'Female');

    const userPrompt = `
        Client Profile / 命主信息:
        Name / 姓名: ${userData.fullname}
        Gender / 性别: ${genderStr}
        Bazi Pillars / 八字: ${baziData.pillars.join(' ')}
        Five Elements / 五行: ${baziData.elements.join(' ')}
        Day Master / 日主: ${baziData.dayMasterElement}
        
        Strict Instructions / 严格要求:
        ${tierInstructions}
        
        Generate the report in ${lang}. ONLY return HTML code (h3, p, strong, ul, li). Do not include markdown code blocks (like \`\`\`html) in the output, just the raw HTML.
    `;

    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7
            })
        });
        const result = await response.json();
        return result.choices[0].message.content.replace(/```html|```/g, '').trim();
    } catch (e) {
        return currentLang === 'en' 
            ? "<p style='color: var(--cinnabar);'>The stars are obscured. Please try again later.</p>" 
            : "<p style='color: var(--cinnabar);'>星象被掩盖，请稍后再试。</p>";
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
            en: { name: "White Gold Obsidian Bracelet", desc: "Forged with Metal energy to enhance decision-making and attract wealth." },
            zh: { name: "白金黑曜石手串", desc: "蕴含纯正金气，助您决断果敢，招财纳福，破除事业迷雾。" }
        },
        '木': {
            en: { name: "Green Sandalwood Zen Beads", desc: "Nourished with Wood energy to promote growth, healing, and creativity." },
            zh: { name: "绿檀木禅意佛珠", desc: "木气生发，养神静心，助旺文昌与事业节节高升。" }
        },
        '水': {
            en: { name: "Deep Sea Aquamarine Talisman", desc: "Flowing with Water energy to bring calm, wisdom, and emotional balance." },
            zh: { name: "深海海蓝宝护符", desc: "水气润泽，化解焦躁，增强沟通与智慧，柔化流年煞气。" }
        },
        '火': {
            en: { name: "Crimson Agate Amulet", desc: "Blazing with Fire energy to boost vitality, passion, and fame." },
            zh: { name: "赤焰南红玛瑙", desc: "火气升腾，激发热情与生命力，助旺贵人缘与名气。" }
        },
        '土': {
            en: { name: "Yellow Citrine Prosperity Sphere", desc: "Grounded with Earth energy to provide stability, trust, and wealth retention." },
            zh: { name: "黄水晶聚宝手链", desc: "厚土承载，稳固根基，极强吸金聚财，让事业与家庭稳如泰山。" }
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

    const recContainer = document.getElementById('recommended-products');
    if (recContainer) {
        const productInfo = productsDB[lackingElement][currentLang === 'zh' ? 'zh' : 'en'];
        const labelNeeded = currentLang === 'zh' ? `五行缺${lackingElement}专属` : `Needs ${lackingElement} Energy`;
        
        recContainer.innerHTML = `
            <div style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 2rem; border-radius: 8px; text-align: center;">
                <div style="font-size: 0.8rem; color: var(--gold); margin-bottom: 0.5rem; font-weight: bold; letter-spacing: 2px;">[ ${labelNeeded} ]</div>
                <h4 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 1rem; color: #fff;">${productInfo.name}</h4>
                <p style="font-size: 0.95rem; opacity: 0.8; margin-bottom: 1.5rem; line-height: 1.6;">${productInfo.desc}</p>
                <a href="#" class="btn btn-primary" style="padding: 0.8rem 2rem; font-size: 1rem;">${currentLang === 'zh' ? '立即结缘' : 'Claim Your Talisman'}</a>
            </div>
        `;
    }
}
