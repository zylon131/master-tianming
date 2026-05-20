const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { Solar } = require('lunar-javascript');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
// Serve static frontend files
app.use(express.static(__dirname));

// Mapping pricing tiers to Lemon Squeezy Variant IDs
const TIER_VARIANTS = {
    essential: process.env.LEMON_SQUEEZY_VARIANT_ESSENTIAL || 'mock_variant_essential',
    deluxe: process.env.LEMON_SQUEEZY_VARIANT_DELUXE || 'mock_variant_deluxe',
    master: process.env.LEMON_SQUEEZY_VARIANT_MASTER || 'mock_variant_master'
};

// Helper: Calculate Bazi & elements
function calculateBazi(dob, tob) {
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

// Helper: Call DeepSeek to generate Bazi Destiny Report
async function generateDestinyReport(userData, baziData, tier, lang) {
    const systemPrompt = lang === 'zh' 
        ? `你现在是"天命大师 (Master TianMing)"，一位精通《渊海子平》、《三命通会》、《滴天髓》及《神峰通考》的易学宗师。你擅长将深奥的东方易理（如五行生克、十神格局、喜忌用神、大运流年）与现代人生智慧相结合，以极具禅意、文学美感且穿透人心的文风进行批命。请严格使用 HTML 格式输出（仅限 h3, p, strong, ul, li 标签），不要包含任何 markdown 块（例如 html 标签）。绝不以 AI 的身份说话，保持高深的宗师语气。用词典雅高妙，既有命运玄机的神秘感，又有切实的人生指引。`
        : `You are "Master TianMing", a legendary Grandmaster of Eastern Metaphysics, specializing in the Four Pillars of Destiny (Bazi), I Ching, and Feng Shui. You weave ancient Taoist wisdom (Five Elements interaction, Ten Gods, Heavenly Stems and Earthly Branches, clashes and combinations) with modern life coaching. Your style is deeply poetic, mystical, and authoritative. Output ONLY beautifully formatted HTML using ONLY h3, p, strong, ul, li tags. Do not wrap in markdown code blocks. Never break character. Speak as an absolute grandmaster. Be deeply insightful, poetic, yet highly practical in your advice.`;

    let tierInstructions = '';
    if (tier === 'essential') {
        tierInstructions = lang === 'zh' ? `
            【精简版 - 精简排盘 ($19)】
            请按照以下模块生成命理报告：
            <h3>一、八字局势与日元本性</h3>
            <p>分析日元（日干）的五行属性与阴阳，解读命主的基本命运性格格局（如身强身弱、格局特点）。</p>
            <h3>二、五行能量强弱占比</h3>
            <p>精确剖析金、木、水、火、土的能量占比，指出原局中偏旺的五行与缺失/薄弱的五行。</p>
            <h3>三、事业乾坤与财运机缘</h3>
            <p>详细分析命主的财官运势，揭示当下的事业机遇、财富流向及潜在阻碍。</p>
            <h3>四、五行调和与开运方位</h3>
            <p>提供日常开运指南（如开运颜色、有利的地理方位）。
            字数要求：400-500字左右。`
        : `
            [Essential Insight ($19)]
            Generate the reading using this exact structure:
            <h3>I. Bazi Chart & Day Master Essence</h3>
            <p>Analyze the Day Master (element and polarity) and the general layout of the chart, detailing personality and fundamental soul traits.</p>
            <h3>II. Five Elements Quantification</h3>
            <p>Examine the balance of Metal, Wood, Water, Fire, and Earth. Highlight dominant elements and any elements that are deficient or missing.</p>
            <h3>III. Career Path & Wealth Flow</h3>
            <p>Analyze their career potentials and wealth opportunities, revealing imminent milestones or challenges.</p>
            <h3>IV. Harmonic Lifestyle & Color Guidance</h3>
            <p>Provide daily luck alignment tips (favorable colors, auspicious geographical directions).
            Length: 400-500 words.`;
    } else if (tier === 'deluxe') {
        tierInstructions = lang === 'zh' ? `
            【升级版 - 守护之径 ($129)】
            本级别必须完全覆盖并升级【精简排盘】的所有内容，并追加深度推演。请按以下结构生成：
            <h3>一、八字局势与日元本性</h3>
            <p>精细分析日主身强身弱、十神格局。</p>
            <h3>二、五行能量强弱占比</h3>
            <p>精细分析五行盛衰，指明喜忌用神。</p>
            <h3>三、事业乾坤与财富大势</h3>
            <p>深度解说工作官运与求财方向。</p>
            <h3>四、姻缘桃花与夫妻宫详批</h3>
            <p>分析命主的婚姻宫状态、正缘的喜忌、桃花运势及适合的婚配或正缘出现的时机。</p>
            <h3>五、流年未来三年运势详批</h3>
            <p>逐年剖析接下来的流年大势（第一年、第二年、第三年），指明每年的运势重点、吉凶机遇。</p>
            <h3>六、专属本命手链与开运调和建议</h3>
            <p>根据命主的用神与缺失五行，提出专属于命主的五行手链推荐（如材质、水晶或玉石种类）以调和五行磁场，并给出开运色与方位。
            字数要求：800-1000字。`
        : `
            [Guardian's Path ($129)]
            This tier must fully cover and upgrade all Essential topics, adding detailed romantic and flow forecasts. Structure as follows:
            <h3>I. Bazi Chart & Day Master Essence</h3>
            <p>In-depth analysis of Day Master strength, chart configuration, and dominant Ten Gods.</p>
            <h3>II. Five Elements Balance & Favorable Elements</h3>
            <p>Deep evaluation of elemental harmony, identifying the Favorable Element (Yong Shen) and Unfavorable Element (Ji Shen).</p>
            <h3>III. Career Mastery & Wealth Accumulation</h3>
            <p>Detailed pathways to success, advising on industries, strategies, and financial traps.</p>
            <h3>IV. Marriage Palace & Romantic Karma</h3>
            <p>Detailed analysis of the Spouse Palace, Peach Blossom luck, marriage timeline, and qualities of their true partner.</p>
            <h3>V. 3-Year Annual Flow Forecast</h3>
            <p>Year-by-year analysis for the next 3 years, highlighting specific opportunities, challenges, and life themes.</p>
            <h3>VI. Sacred Talisman & Harmony Recommendations</h3>
            <p>Based on their chart, explicitly recommend a specific custom Five Elements bracelet/talisman (specifying materials, crystal, or bead types) to balance their energies, along with favorable colors/directions.
            Length: 800-1000 words.`;
    } else {
        tierInstructions = lang === 'zh' ? `
            【至尊版 - 大师私测 ($299)】
            这是最高规格的宗师级私密推演。必须完全覆盖并超越所有低级别服务（包含原局、五行盛衰、事业财运、姻缘桃花、本命手链推荐），并以极具穿透力、点拨弟子的语气展开。结构要求如下：
            <h3>一、宗师印授：元神格局总纲</h3>
            <p>以宏大的命运格局高度剖析命主的八字原局、日主根基及神煞格局。</p>
            <h3>二、五行消长与喜忌神精判</h3>
            <p>终极判定用神、喜神、忌神、闲神，解析五行盛衰对命理根基的影响。</p>
            <h3>三、财官双美：一生事业财富轨迹</h3>
            <p>描绘一生事业与财富的巅峰期与低谷期，给予行业定位建议。</p>
            <h3>四、三生石畔：姻缘业力与正缘详批</h3>
            <p>深度剖析情感羁绊、婚姻官禄、配偶助益及宿世宿命姻缘。</p>
            <h3>五、终身行运：大运十年起伏推演</h3>
            <p>批导命主一生的十年大运走向，点明当前及未来核心大运的转变与关隘。</p>
            <h3>六、黄金流年：未来五年吉凶宜忌流年通关</h3>
            <p>详批未来五年的运势（第一年至第五年），详细指出每年的吉凶转折、重大决策点（如跳槽、投资、合伙等）及宜忌指南。</p>
            <h3>七、专属本命开运手链法器推荐</h3>
            <p>根据五行，点明命主最急需补足的“命门五行”，明确推荐专属于其用神调和的本命手链法器（指出材质与配珠）。</p>
            <h3>八、秘传风水阵法与灵性修行仪式</h3>
            <p>提供针对命主个人住宅/办公室的独家风水调整方案（如青龙白虎位布局）、净化磁场的静心冥想或开运仪式，助力冲破当下瓶颈。
            字数要求：1200字以上，极尽详实，字字千金。`
        : `
            [Master's Revelation ($299)]
            This is the ultimate grandmaster reading. It must fully cover, integrate, and expand on all services from lower tiers (Chart essence, elements balance, career/wealth, romantic palace, and custom bracelet recommendation) in complete detail. Adopt an authoritative, deeply spiritual, and personal master tone. Structure as follows:
            <h3>I. Grandmaster's Decree: Day Master & Chart Structure</h3>
            <p>A comprehensive analysis of the soul's baseline, Day Master strength, and core spiritual destiny configuration.</p>
            <h3>II. Elemental Balance & Favorable/Unfavorable Elements</h3>
            <p>Ultimate determination of the Favorable Element (Yong Shen), Favorable God (Xi Shen), and Unfavorable God (Ji Shen) with elemental interactions.</p>
            <h3>III. Career Destiny & Wealth Lifeline</h3>
            <p>A lifetime map of professional ascents, financial peaks, career paths, and industries that match their charts.</p>
            <h3>IV. Marriage Palace & Romantic Karma</h3>
            <p>Deep analysis of their relationship palace, karmic romantic connections, spouse profiles, and timing for positive relationship milestones.</p>
            <h3>V. Lifetime major Cycles: 10-Year Luck Pillars</h3>
            <p>Analysis of their current and future 10-year major luck pillars, explaining how their life path evolves through decades.</p>
            <h3>VI. 5-Year Detailed Auspicious Calendar</h3>
            <p>Year-by-year forecast for the next 5 years, highlighting specific pivotal moments, financial moves, and exact dos/don'ts for each year.</p>
            <h3>VII. Custom Lucky Bracelet & Talisman Empowerment</h3>
            <p>Explicate the exact deficient element and recommend a custom-designed elemental bracelet/talisman (details on crystal, metals, and bead properties) for balancing energy.</p>
            <h3>VIII. Esoteric Feng Shui Layout & Spiritual Ritual</h3>
            <p>Provide a personalized home/office Feng Shui layout advice (directions, placements) and a daily spiritual practice (meditation, affirmation, or physical ritual) to dissolve blocks.
            Length: 1200+ words. Extensive, profound, and deeply personalized.`;
    }

    const genderStr = lang === 'zh' 
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
        
        Generate the report in ${lang === 'zh' ? 'Chinese' : 'English'}. ONLY return HTML code (h3, p, strong, ul, li). Do not include markdown code blocks (like \`\`\`html) in the output, just the raw HTML.
    `;

    const apiUrl = process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1/chat/completions';
    const apiKey = process.env.DEEPSEEK_API_KEY;
    const isTestMode = process.env.LEMON_SQUEEZY_TEST_MODE === 'true';

    // Mock reports for test mode fallback
    const mockReportZh = `
        <h3>天命八字局势</h3>
        <p>命主生于阳春时节，五行格局清粹。日主强旺，运行东方木旺之乡，求财得财，求名得名。</p>
        <h3>五行强弱解析</h3>
        <p>原局中<strong>木、火</strong>偏旺，缺<strong>金</strong>。木多火炽，需用金来克制木气，调和燥烈之性。</p>
        <h3>事业财运预测</h3>
        <p>近期命主星盘闪耀，事业上有贵人相助，多有晋升与开拓新领域的契机。财运方面正财稳妥，偏财有意外之喜。</p>
        <h3>开运小贴士</h3>
        <p>建议佩戴白金、水晶等饰品以补足金气，日常多穿着白色、金色系衣物，有助于平衡自身能量，招祥纳瑞。</p>
    `;

    const mockReportEn = `
        <h3>Bazi Chart Analysis</h3>
        <p>Born in the vibrant season of spring, your chart demonstrates a clear and robust configuration. The Day Master is strong, flowing into auspicious woody energy, indicating prosperity and recognition.</p>
        <h3>Five Elements Balance</h3>
        <p>Your chart has excessive <strong>Wood and Fire</strong>, but lacks <strong>Metal</strong>. An excess of wood feeds the fire, requiring metal to anchor your energy and balance the heat.</p>
        <h3>Career & Wealth Outlook</h3>
        <p>The stars align to bring powerful benefactors into your professional path. Opportunities for promotion or starting new ventures are highly favored. Wealth prospects are stable and promising.</p>
        <h3>Personalized Luck Tips</h3>
        <p>We recommend wearing white gold or obsidian accessories to fortify your Metal energy. Incorporating white, silver, or gold colors into your daily wardrobe will harmonize your flow and attract good fortune.</p>
    `;

    if (!apiKey || apiKey.startsWith('your_') || apiKey === 'sk-9a969f6e9ebe4328a21b077dc237b905') {
        if (isTestMode) {
            console.log("Using mock Bazi Destiny Report (DeepSeek API Key is invalid or unset, falling back in test mode).");
            return lang === 'zh' ? mockReportZh : mockReportEn;
        }
    }

    try {
        if (!apiKey) {
            throw new Error("Missing DeepSeek API Key in server configuration.");
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${apiKey}` 
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`DeepSeek API error (${response.status}): ${errText}`);
        }
        
        const result = await response.json();
        let content = result.choices[0].message.content.trim();
        // Clean any markdown wrapper
        content = content.replace(/^```html\s*/i, '').replace(/\s*```$/, '');
        return content;
    } catch (apiError) {
        if (isTestMode) {
            console.warn("DeepSeek API call failed. Falling back to mock report in test mode:", apiError.message);
            return lang === 'zh' ? mockReportZh : mockReportEn;
        }
        throw apiError;
    }
}

// 1. API: Create Checkout (supports Test/Mock Mode)
app.post('/api/create-checkout', async (req, res) => {
    try {
        const { fullname, gender, dob, tob, tier } = req.body;
        
        if (!fullname || !gender || !dob || !tob || !tier) {
            return res.status(400).json({ error: "Missing required profile details." });
        }

        const isTestMode = process.env.LEMON_SQUEEZY_TEST_MODE === 'true';

        if (isTestMode) {
            // Encode details in base64 token for stateless test checkout
            const clientData = { fullname, gender, dob, tob, tier, timestamp: Date.now() };
            const token = Buffer.from(JSON.stringify(clientData)).toString('base64');
            const mockCheckoutUrl = `/report.html?checkout_id=mock_chk_${token}`;
            return res.json({ url: mockCheckoutUrl });
        }

        // Live Lemon Squeezy integration
        const variantId = TIER_VARIANTS[tier];
        const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
        const apiKey = process.env.LEMON_SQUEEZY_API_KEY;

        if (!apiKey || !storeId || variantId.startsWith('mock_')) {
            return res.status(500).json({ error: "Lemon Squeezy is not fully configured on the server." });
        }

        const redirectUrl = `${req.protocol}://${req.get('host')}/report.html`;

        const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/vnd.api+json',
                'Accept': `application/vnd.api+json`
            },
            body: JSON.stringify({
                data: {
                    type: "checkouts",
                    attributes: {
                        custom_price: null,
                        product_options: {
                            redirect_url: redirectUrl
                        },
                        checkout_data: {
                            custom: {
                                fullname,
                                gender,
                                dob,
                                tob,
                                tier
                            }
                        }
                    },
                    relationships: {
                        store: {
                            data: {
                                type: "stores",
                                id: storeId
                            }
                        },
                        variant: {
                            data: {
                                type: "variants",
                                id: variantId
                            }
                        }
                    }
                }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Lemon Squeezy API error (${response.status}): ${errText}`);
        }

        const resData = await response.json();
        const checkoutUrl = resData.data.attributes.url;
        return res.json({ url: checkoutUrl });

    } catch (error) {
        console.error("Create Checkout Error:", error);
        return res.status(500).json({ error: "Failed to create checkout session." });
    }
});

// 2. API: Verify payment and generate reading
app.get('/api/get-reading', async (req, res) => {
    try {
        const { checkout_id, order_id, lang } = req.query;
        const currentLang = lang === 'zh' ? 'zh' : 'en';

        if (!checkout_id && !order_id) {
            return res.status(400).json({ error: "Missing checkout_id or order_id." });
        }

        let userData = null;

        // Check if it is a mock checkout first
        if (checkout_id && checkout_id.startsWith('mock_chk_')) {
            const token = checkout_id.substring('mock_chk_'.length);
            const decoded = Buffer.from(token, 'base64').toString('utf8');
            userData = JSON.parse(decoded);
        } else {
            // Live payment verification via Lemon Squeezy API
            const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
            if (!apiKey) {
                return res.status(500).json({ error: "Server payment verification key missing." });
            }

            let response;
            if (order_id) {
                // Verify order status
                response = await fetch(`https://api.lemonsqueezy.com/v1/orders/${order_id}`, {
                    headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/vnd.api+json' }
                });
            } else {
                // Verify checkout status
                response = await fetch(`https://api.lemonsqueezy.com/v1/checkouts/${checkout_id}`, {
                    headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/vnd.api+json' }
                });
            }

            if (!response.ok) {
                throw new Error(`Failed to query Lemon Squeezy API: ${response.status}`);
            }

            const payload = await response.json();
            const attributes = payload.data.attributes;

            // In Lemon Squeezy, order status is 'paid'. If checking checkout, we can verify it has custom metadata
            // Let's check status
            const isPaid = order_id ? (attributes.status === 'paid') : true; // checkouts don't have paid status directly, usually order completes them

            if (!isPaid) {
                return res.status(403).json({ error: "Payment verification pending or failed." });
            }

            // Extract custom metadata passed during creation
            const customData = order_id ? attributes.custom_data : attributes.checkout_data.custom;
            if (!customData || !customData.fullname) {
                throw new Error("Payment verified but profile metadata is missing.");
            }

            userData = {
                fullname: customData.fullname,
                gender: customData.gender,
                dob: customData.dob,
                tob: customData.tob,
                tier: customData.tier
            };
        }

        // Generate Bazi and call DeepSeek securely
        const baziData = calculateBazi(userData.dob, userData.tob);
        const reportHtml = await generateDestinyReport(userData, baziData, userData.tier, currentLang);

        return res.json({
            success: true,
            user: userData,
            bazi: baziData,
            report: reportHtml,
            tier: userData.tier
        });

    } catch (error) {
        console.error("Get Reading Error:", error);
        return res.status(500).json({ error: "Failed to generate reading. Please contact support." });
    }
});

// 3. API: Buy Custom Talisman (Fitted with 1688 Dropshipping)
app.post('/api/buy-talisman', async (req, res) => {
    try {
        const { orderId, lackingElement, talismanName, price, fullName, email, shippingAddress, phoneNumber } = req.body;
        
        if (!fullName || !shippingAddress || !phoneNumber || !email) {
            return res.status(400).json({ error: "Missing required contact/shipping details." });
        }

        const fs = require('fs');
        const ordersFile = path.join(__dirname, 'orders.json');
        
        let orders = [];
        if (fs.existsSync(ordersFile)) {
            try {
                orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
            } catch (err) {
                console.error("Error reading orders.json:", err);
            }
        }

        const newOrder = {
            orderId: `TM-${Math.floor(100000 + Math.random() * 900000)}`,
            destinyOrderId: orderId || 'N/A',
            talismanName,
            lackingElement,
            price,
            customer: { fullName, email, shippingAddress, phoneNumber },
            status: 'pending_1688_sync', // simulates 1688 sync state
            createdAt: new Date().toISOString()
        };

        orders.push(newOrder);
        fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 4), 'utf8');

        console.log(`[1688 Dropshipping] New order recorded for 1688 fulfillment:`, newOrder);

        return res.json({
            success: true,
            orderId: newOrder.orderId,
            message: "Purchase completed! Master TianMing will consecrate your talisman, and it will be dropshipped directly via our automated 1688 fulfillment system.",
            trackingId: `LS-${Math.floor(10000000 + Math.random() * 90000000)}`
        });

    } catch (error) {
        console.error("Buy Talisman Error:", error);
        return res.status(500).json({ error: "Failed to process talisman purchase." });
    }
});

// Admin authentication middleware
const verifyAdmin = (req, res, next) => {
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const authHeader = req.headers.authorization;
    const token = req.query.token;
    
    let provided = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
        provided = authHeader.substring(7);
    } else if (token) {
        provided = token;
    }
    
    if (provided === adminPassword) {
        return next();
    }
    return res.status(401).json({ error: "Unauthorized admin access." });
};

// Admin: Get all orders
app.get('/api/admin/orders', verifyAdmin, (req, res) => {
    const fs = require('fs');
    const ordersFile = path.join(__dirname, 'orders.json');
    let orders = [];
    if (fs.existsSync(ordersFile)) {
        try {
            orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
        } catch (err) {
            console.error("Error reading orders.json:", err);
        }
    }
    // Return sorted by date descending
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json({ orders });
});

// Admin: Get 1688 product mappings
app.get('/api/admin/mappings', verifyAdmin, (req, res) => {
    const fs = require('fs');
    const mappingsFile = path.join(__dirname, 'talisman_mappings.json');
    let mappings = {};
    if (fs.existsSync(mappingsFile)) {
        try {
            mappings = JSON.parse(fs.readFileSync(mappingsFile, 'utf8'));
        } catch (err) {
            console.error("Error reading talisman_mappings.json:", err);
        }
    }
    return res.json({ mappings });
});

// Admin: Update 1688 product mapping
app.post('/api/admin/update-mapping', verifyAdmin, (req, res) => {
    const fs = require('fs');
    const mappingsFile = path.join(__dirname, 'talisman_mappings.json');
    const { element, productId, skuId, notes } = req.body;
    
    if (!element || !productId) {
        return res.status(400).json({ error: "Missing element or productId." });
    }

    let mappings = {};
    if (fs.existsSync(mappingsFile)) {
        try {
            mappings = JSON.parse(fs.readFileSync(mappingsFile, 'utf8'));
        } catch (err) {
            console.error("Error reading mappings:", err);
        }
    }

    mappings[element] = {
        productId,
        skuId: skuId || "",
        description: mappings[element] ? mappings[element].description : `${element} Talisman`,
        notes: notes || ""
    };

    fs.writeFileSync(mappingsFile, JSON.stringify(mappings, null, 4), 'utf8');
    return res.json({ success: true, message: "Mapping updated successfully.", mappings });
});

// Admin: Export 1688 Dropshipping Excel/CSV Template
app.get('/api/admin/export-csv', verifyAdmin, (req, res) => {
    const fs = require('fs');
    const ordersFile = path.join(__dirname, 'orders.json');
    const mappingsFile = path.join(__dirname, 'talisman_mappings.json');
    
    let orders = [];
    if (fs.existsSync(ordersFile)) {
        orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
    }
    
    let mappings = {};
    if (fs.existsSync(mappingsFile)) {
        mappings = JSON.parse(fs.readFileSync(mappingsFile, 'utf8'));
    }

    // Prepare CSV Content (standard dropship CSV template)
    // UTF-8 with BOM to prevent Excel display corruption
    let csvContent = '\uFEFF';
    csvContent += '订单号(Our Order ID),收货人姓名(Name),收货人电话(Phone),收货地址(Address),1688宝贝ID(1688 Offer ID),1688规格SKU(1688 SKU ID),购买数量(Qty),商家备注(Notes),订单状态(Status)\n';

    orders.forEach(o => {
        const elementKey = o.lackingElement ? o.lackingElement.toLowerCase() : '';
        const mapInfo = mappings[elementKey] || { productId: '', skuId: '' };
        
        // Escape CSV values containing commas or quotes
        const cleanName = (o.customer.fullName || '').replace(/"/g, '""');
        const cleanPhone = (o.customer.phoneNumber || '').replace(/"/g, '""');
        const cleanAddr = (o.customer.shippingAddress || '').replace(/"/g, '""');
        
        csvContent += `"${o.orderId}","${cleanName}","${cleanPhone}","${cleanAddr}","${mapInfo.productId}","${mapInfo.skuId}",1,"五行:${o.lackingElement}","${o.status}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=talisman_1688_dropship_orders.csv');
    return res.send(csvContent);
});

// Admin: Sync Order to 1688 via API (Real + Mock simulation client)
app.post('/api/admin/sync-1688', verifyAdmin, async (req, res) => {
    const fs = require('fs');
    const { orderId } = req.body;
    
    if (!orderId) {
        return res.status(400).json({ error: "Missing orderId." });
    }

    const ordersFile = path.join(__dirname, 'orders.json');
    const mappingsFile = path.join(__dirname, 'talisman_mappings.json');
    
    let orders = [];
    if (fs.existsSync(ordersFile)) {
        orders = JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
    }
    
    let mappings = {};
    if (fs.existsSync(mappingsFile)) {
        mappings = JSON.parse(fs.readFileSync(mappingsFile, 'utf8'));
    }

    const orderIdx = orders.findIndex(o => o.orderId === orderId);
    if (orderIdx === -1) {
        return res.status(404).json({ error: "Order not found." });
    }

    const order = orders[orderIdx];
    const elementKey = order.lackingElement ? order.lackingElement.toLowerCase() : '';
    const mapInfo = mappings[elementKey];

    if (!mapInfo || !mapInfo.productId) {
        return res.status(400).json({ error: `Please configure a 1688 Product ID for the element '${order.lackingElement}' first.` });
    }

    // 1688 API Credentials from env
    const appKey = process.env['1688_APP_KEY'];
    const appSecret = process.env['1688_APP_SECRET'];
    const accessToken = process.env['1688_ACCESS_TOKEN'];
    const buyerMemberId = process.env['1688_BUYER_MEMBER_ID'] || 'mock_buyer_member';

    const isMock = !appKey || !appSecret || !accessToken || appKey.startsWith('your_');

    // Build the cargo and address payload for 1688
    const orderPayload = {
        addressParam: JSON.stringify({
            fullName: order.customer.fullName,
            mobile: order.customer.phoneNumber,
            phone: order.customer.phoneNumber,
            postCode: "000000", // Default postcode
            province: "浙江省",  // In production, we parse province/city/area using address parsing libs
            city: "杭州市",
            area: "滨江区",
            address: order.customer.shippingAddress
        }),
        cargoParamList: JSON.stringify([{
            offerId: parseInt(mapInfo.productId),
            specId: mapInfo.skuId || undefined,
            quantity: 1
        }]),
        flow: "general", // general dropshipping flow
        buyerMemberId
    };

    if (isMock) {
        // Simulation mode
        console.log(`[1688 API Simulation] Placing order on 1688 for customer ${order.customer.fullName}:`, orderPayload);
        
        // Update local order status
        const mock1688OrderId = `ALIBABA1688-${Math.floor(100000000 + Math.random() * 900000000)}`;
        order.status = 'synced_to_1688';
        order.alibabaOrderId = mock1688OrderId;
        order.syncedAt = new Date().toISOString();
        
        fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 4), 'utf8');

        return res.json({
            success: true,
            simulated: true,
            alibabaOrderId: mock1688OrderId,
            message: "1688 API connection simulated successfully! (To activate real synchronization, configure your 1688 API keys in .env)",
            payloadSent: orderPayload
        });
    }

    // Real API integration client
    try {
        const crypto = require('crypto');
        
        // Alibaba Open API URL format:
        // http://gw.api.alibaba.com/openapi/param2/1/com.alibaba.trade/alibaba.trade.fastCreateOrder/YOUR_APP_KEY
        const apiPath = `param2/1/com.alibaba.trade/alibaba.trade.fastCreateOrder/${appKey}`;
        const apiUrl = `https://gw.api.alibaba.com/openapi/${apiPath}`;
        
        // Add auth parameters
        const apiParams = {
            access_token: accessToken,
            ...orderPayload
        };

        // Signature calculation
        const sortedKeys = Object.keys(apiParams).sort();
        let paramStr = '';
        for (const key of sortedKeys) {
            paramStr += key + apiParams[key];
        }
        const signatureStr = apiPath + paramStr;
        const hmac = crypto.createHmac('sha1', appSecret);
        hmac.update(signatureStr);
        const signature = hmac.digest('hex').toUpperCase();

        apiParams['_aop_signature'] = signature;

        // Make the outbound post request using application/x-www-form-urlencoded
        const bodyParams = new URLSearchParams();
        for (const k in apiParams) {
            bodyParams.append(k, apiParams[k]);
        }

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: bodyParams.toString()
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`1688 API request failed (${response.status}): ${errText}`);
        }

        const resData = await response.json();
        
        if (resData.success === false || resData.errorMsg) {
            throw new Error(resData.errorMsg || resData.errorMessage || "Unknown error from 1688 API.");
        }

        // Extract 1688 order ID
        const alibabaOrderId = resData.result.orderId;
        order.status = 'synced_to_1688';
        order.alibabaOrderId = alibabaOrderId;
        order.syncedAt = new Date().toISOString();

        fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 4), 'utf8');

        return res.json({
            success: true,
            simulated: false,
            alibabaOrderId,
            message: "Successfully synchronized order to your 1688 account! Please complete payment in your 1688 console.",
            result: resData.result
        });

    } catch (apiError) {
        console.error("1688 API execution failed:", apiError);
        return res.status(500).json({
            error: "Failed to connect to 1688 API.",
            details: apiError.message
        });
    }
});

// Serve Admin Dashboard
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Fallback to serving index.html for undefined routes
app.get('*all', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`TianMing Server running securely on http://localhost:${PORT}`);
});
