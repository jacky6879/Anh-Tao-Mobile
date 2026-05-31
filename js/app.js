/**
 * app.js - Unified Master Client Controller (Anh Táo Mobile)
 * Dynamically queries Supabase databases (or offline fallbacks) to render
 * products, used catalogs, repair price calculators, blog posts, and store details.
 */

// Global state variables
const state = {
    activeCategory: 'new',
    selectedCompareIds: [],
    cartCount: 0,
    currentHeroSlide: 0,
    products: [],
    repairs: [],
    blogs: [],
    pageContent: {}
};

// Unified Application Bootloader
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch live data from pipeline (Supabase or fallback local caches)
    await loadDatabaseDetails();

    // 2. Render dynamic landing page copy (Hotlines, addresses, email)
    renderDynamicPageContent();

    // 3. Initialize visual utilities
    initScrollEffects();
    initNavigation();

    // 4. Conditional Module Initialization (Page-specific loaders)
    if (document.querySelector('.hero-slides')) {
        initHeroSlider();
    }
    if (document.getElementById('main-product-grid')) {
        initCatalog();
    }
    if (document.getElementById('qc-flow-steps')) {
        initQCSection();
    }
    if (document.getElementById('installment-form')) {
        initInstallmentForm();
    }
    if (document.getElementById('compare-modal')) {
        initCompareSystem();
    }
    if (document.getElementById('repair-phone-model')) {
        initRepairEstimator();
    }
    if (document.getElementById('cu-grid')) {
        initUsedCatalog();
    }
    if (document.getElementById('newsletter-form')) {
        initNewsHub();
    }

    // 5. Initialize Theme Switcher
    initThemeToggle();
});

// --- Dynamic Content Loader ---
async function loadDatabaseDetails() {
    try {
        console.group("⚙️ [Database Sync] Loading all store parameters...");
        // Async call backend fetches
        state.products = await fetchProducts();
        state.repairs = await fetchRepairs();
        state.pageContent = await fetchPageContent();
        
        // Handle blogs fetching if tin-tuc exists
        if (document.getElementById('newsletter-form')) {
            state.blogs = await fetchBlogs();
        }
        console.log("Synchronized Products Count:", state.products.length);
        console.log("Synchronized Repairs Rows:", state.repairs.length);
        console.log("Synchronized Page Copy:", Object.keys(state.pageContent).length);
        console.groupEnd();
    } catch (err) {
        console.error("❌ [Database Sync] Data fetch failed, utilising cached fallbacks:", err);
    }
}

// Render dynamic address and contact copies across all pages
function renderDynamicPageContent() {
    const content = state.pageContent;
    if (!content) return;

    console.log("✏️ [DOM Update] Rendering dynamic store details from database...");

    // 1. Update Hotlines
    const hotlineElements = document.querySelectorAll('[id*="hotline-text"], [class*="hotline"], p, span, a');
    hotlineElements.forEach(el => {
        if (el.tagName === 'A' && el.href.startsWith('tel:')) {
            el.href = `tel:${content.hotline.replace(/\s+/g, '').replace(/\./g, '')}`;
        }
        // If repair specific
        if (el.id === 'hotline-repair-text' && content.hotline_repair) {
            el.textContent = content.hotline_repair;
        } else {
            if (el.children.length === 0 && (el.textContent.includes('1900.6822') || el.textContent.includes('08 1900 0011'))) {
                el.textContent = el.textContent.replace(/1900\.6822/g, content.hotline);
                el.textContent = el.textContent.replace(/08 1900 0011/g, content.hotline);
            }
        }
    });

    // 2. Update Shop Address (1013 CMT8, P. Thủ Dầu Một, Hồ Chí Minh) and Maps Link
    // Target any link pointing to Google Maps and update dynamically
    const addressLinks = document.querySelectorAll('a[href*="maps.app.goo.gl"], a[href*="maps.google.com"], a[href*="goo.gl/maps"]');
    addressLinks.forEach(link => {
        if (content.maps_url) {
            link.href = content.maps_url;
        }
        link.textContent = content.address;
    });

    // Update other elements containing raw addresses ONLY if they don't have children tags (preserves inner HTML hyperlink layouts)
    const addressElements = document.querySelectorAll('p, span, div');
    addressElements.forEach(el => {
        if (el.children.length === 0 && (el.textContent.includes('123 Đường Cầu Giấy') || el.textContent.includes('1013 CMT8'))) {
            el.textContent = el.textContent.replace(/123 Đường Cầu Giấy, Phường Quan Hoa, Quận Cầu Giấy, Hà Nội/g, content.address);
            el.textContent = el.textContent.replace(/123 Đường Cầu Giấy/g, content.address);
            el.textContent = el.textContent.replace(/1013 CMT8, Thủ Dầu Một, Bình Dương/g, content.address);
            el.textContent = el.textContent.replace(/1013 CMT8, P\. Thủ Dầu Một, Hồ Chí Minh/g, content.address);
        }
    });

    // 3. Update Hero Title (if elements exist on index)
    const heroTitleText = document.querySelector('.hero-slide:nth-child(1) .hero-title');
    const heroDescText = document.querySelector('.hero-slide:nth-child(1) .hero-desc');
    if (heroTitleText && content.hero_title_1) {
        heroTitleText.innerHTML = `${content.hero_title_1}<br><span class="gradient-text glow-text">${content.hero_title_2}</span>`;
    }
    if (heroDescText && content.hero_desc) {
        heroDescText.textContent = content.hero_desc;
    }
}

// --- Visual Utilities ---
function initScrollEffects() {
    const header = document.querySelector('header');
    const backToTop = document.querySelector('.floating-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (backToTop) {
            if (window.scrollY > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('open');
            menuToggle.classList.toggle('active');
            
            const spans = menuToggle.querySelectorAll('span');
            if(menuToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
}

// --- Home Hero Slide Banner ---
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const bullets = document.querySelectorAll('.hero-bullet');
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        bullets.forEach(bullet => bullet.classList.remove('active'));

        if (slides[index] && bullets[index]) {
            slides[index].classList.add('active');
            bullets[index].classList.add('active');
        }
        state.currentHeroSlide = index;
    }

    function nextSlide() {
        let index = (state.currentHeroSlide + 1) % slides.length;
        showSlide(index);
    }

    function startInterval() {
        slideInterval = setInterval(nextSlide, 6000);
    }

    bullets.forEach((bullet, i) => {
        bullet.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(i);
            startInterval();
        });
    });

    const sliderContainer = document.querySelector('.hero');
    if (sliderContainer) {
        let startX = 0;
        sliderContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        sliderContainer.addEventListener('touchend', (e) => {
            let diffX = e.changedTouches[0].clientX - startX;
            if (Math.abs(diffX) > 60) {
                clearInterval(slideInterval);
                if (diffX > 0) {
                    let index = (state.currentHeroSlide - 1 + slides.length) % slides.length;
                    showSlide(index);
                } else {
                    let index = (state.currentHeroSlide + 1) % slides.length;
                    showSlide(index);
                }
                startInterval();
            }
        }, { passive: true });
    }

    showSlide(0);
    startInterval();
}

// --- Home Product Catalog ---
function initCatalog() {
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            state.activeCategory = category;
            
            renderProducts(category);
        });
    });

    renderProducts('new');
}

function renderProducts(category) {
    const productGrid = document.getElementById('main-product-grid');
    if (!productGrid) return;
    productGrid.innerHTML = '';

    const filtered = state.products.filter(p => p.category === category);

    filtered.forEach(p => {
        const isCompareSelected = state.selectedCompareIds.includes(p.id);
        const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price);
        const formatOriginal = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.originalPrice);

        const card = document.createElement('div');
        card.className = `product-card`;
        card.dataset.id = p.id;
        
        let specsHTML = '';
        if (category !== 'accessory') {
            specsHTML = `
                <div class="product-specs-brief">
                    <span class="spec-pill">${p.specs.screen.split(',')[0]}</span>
                    <span class="spec-pill">${p.specs.cpu.split('(')[0]}</span>
                    <span class="spec-pill">${p.specs.ram} RAM</span>
                </div>
            `;
        } else {
            specsHTML = `
                <div class="product-specs-brief">
                    <span class="spec-pill">Phụ kiện sành điệu</span>
                    <span class="spec-pill">BH 12T 1 Đổi 1</span>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="product-tag">
                <span class="badge badge-primary">${p.badge}</span>
            </div>
            <div class="product-img-container">
                <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
            </div>
            <div class="product-body">
                <a href="#installment-form-section" class="product-title" onclick="selectFormModel('${p.id}')">${p.name}</a>
                <div class="product-meta-row">
                    <div class="product-rating">
                        ★ ${p.rating.toFixed(1)} <span>(${p.reviews})</span>
                    </div>
                    <div class="product-verified">
                        ✓ Đã kiểm định
                    </div>
                </div>
                ${specsHTML}
                <div class="product-footer">
                    <div class="product-price-block">
                        <span class="original-price">${formatOriginal}</span>
                        <span class="sale-price">${formatPrice}</span>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn-icon-only compare-toggle-btn ${isCompareSelected ? 'active' : ''}" 
                                onclick="toggleComparison('${p.id}')" 
                                title="So sánh nhanh thông số" 
                                style="${isCompareSelected ? 'background: var(--primary); color: #fff;' : ''}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                            </svg>
                        </button>
                        <button class="btn-icon-only" onclick="addToCart('${p.name}')" title="Mua ngay">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });

        productGrid.appendChild(card);
    });
}

// --- Cart Notification ---
function addToCart(productName) {
    state.cartCount++;
    const badge = document.querySelector('.cart-badge');
    if (badge) badge.textContent = state.cartCount;
    showToast('🛒 Giỏ hàng cập nhật', `${productName} đã được thêm vào giỏ hàng của bạn.`, 'success');
}

function showToast(title, desc, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'ℹ️';
    if(type === 'success') icon = '✓';
    
    toast.innerHTML = `
        <div class="toast-icon">${icon}</div>
        <div class="toast-body">
            <div class="toast-title">${title}</div>
            <div class="toast-desc">${desc}</div>
        </div>
    `;

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 50);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// --- 15-Step Quality Check ---
const QC_STEPS = [
    { num: 'Bước 01', title: 'Thẩm định ngoại hình & Vỏ máy', desc: 'Kiểm tra trầy xước viền, cấn móp vỏ, phát hiện nứt vỡ bằng kính hiển vi chuyên dụng.' },
    { num: 'Bước 04', title: 'Hiệu suất & Sức khỏe Pin', desc: 'Kiểm tra chu kỳ sạc, đo dòng sạc thực tế, cam kết hiệu suất dung lượng đạt chuẩn tốt nhất (>88%).' },
    { num: 'Bước 08', title: 'Màn hình cảm ứng & Lớp hiển thị', desc: 'Chạy phổ quang kiểm tra điểm chết, ám ố màn, phản quang, đo độ trễ lớp cảm ứng điện dung.' },
    { num: 'Bước 12', title: 'Cụm Camera & Cảm biến quang', desc: 'Kiểm định chống rung quang học OIS, lấy nét Laser, quét cảm biến chiều sâu LiDAR và camera trước.' },
    { num: 'Bước 15', title: 'Kết nối mạng & Bảo mật Sinh trắc', desc: 'Đo cường độ sóng 5G/LTE, Wifi, test bảo mật vân tay Touch ID hoặc khuôn mặt Face ID hoạt động chính xác.' }
];

function initQCSection() {
    const listContainer = document.getElementById('qc-flow-steps');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    QC_STEPS.forEach((step, idx) => {
        const item = document.createElement('div');
        item.className = `qc-step-card ${idx === 0 ? 'active' : ''}`;
        item.innerHTML = `
            <div class="qc-step-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div class="qc-step-info">
                <div class="qc-step-number">${step.num}</div>
                <div class="qc-step-title">${step.title}</div>
                <div class="qc-step-desc">${step.desc}</div>
            </div>
        `;

        item.addEventListener('click', () => {
            document.querySelectorAll('.qc-step-card').forEach(c => c.classList.remove('active'));
            item.classList.add('active');
            
            const ray = document.getElementById('scanner-visual-ray');
            if (ray) {
                ray.style.animation = 'none';
                void ray.offsetWidth;
                ray.style.animation = 'scanRay 4s ease-in-out infinite';
            }
            showToast('🔍 Đang kiểm định kĩ thuật', `Đang quét mô phỏng: ${step.title}`, 'info');
        });

        listContainer.appendChild(item);
    });
}

// --- Product Specifications Comparator ---
function toggleComparison(productId) {
    const index = state.selectedCompareIds.indexOf(productId);
    
    if (index > -1) {
        state.selectedCompareIds.splice(index, 1);
    } else {
        if (state.selectedCompareIds.length >= 3) {
            showToast('⚠️ Giới hạn so sánh', 'Bạn chỉ được chọn tối đa 3 sản phẩm để so sánh cùng lúc.', 'info');
            return;
        }
        state.selectedCompareIds.push(productId);
    }
    
    // Refresh catalog grids
    if (document.getElementById('cu-grid')) {
        renderUsedCatalog();
    } else {
        renderProducts(state.activeCategory);
    }
    updateCompareBar();
}

function updateCompareBar() {
    const bar = document.getElementById('compare-bar');
    if (!bar) return;
    const list = bar.querySelector('.compare-selected-list');
    
    if (state.selectedCompareIds.length === 0) {
        bar.classList.remove('show');
        return;
    }

    list.innerHTML = '';
    state.selectedCompareIds.forEach(id => {
        const prod = state.products.find(p => p.id === id);
        if (!prod) return;
        const item = document.createElement('div');
        item.className = 'compare-item-bubble';
        item.innerHTML = `
            <span>${prod.name.split(' - ')[0]}</span>
            <button onclick="toggleComparison('${prod.id}')">✕</button>
        `;
        list.appendChild(item);
    });

    bar.classList.add('show');
}

function launchComparatorModal() {
    const modal = document.getElementById('compare-modal');
    if (!modal) return;
    const tableWrapper = modal.querySelector('.comparison-table-wrapper');
    
    if(state.selectedCompareIds.length === 0) return;

    const selectedProds = state.selectedCompareIds.map(id => state.products.find(p => p.id === id)).filter(Boolean);
    
    let headersHTML = `<th>Đặc tính so sánh</th>`;
    selectedProds.forEach(p => {
        const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price);
        headersHTML += `
            <th class="comparison-product-col">
                <center>
                    <img src="${p.image}" class="comparison-img" alt="${p.name}"><br>
                    <div class="comparison-product-name">${p.name.split(' - ')[0]}</div>
                    <div class="comparison-product-price">${formatPrice}</div>
                </center>
            </th>
        `;
    });

    const compareFeatures = [
        { key: 'screen', label: 'Màn hình hiển thị' },
        { key: 'cpu', label: 'Bộ vi xử lý (CPU)' },
        { key: 'ram', label: 'Bộ nhớ RAM' },
        { key: 'storage', label: 'Bộ nhớ lưu trữ' },
        { key: 'battery', label: 'Tình trạng & Dung lượng Pin' },
        { key: 'condition', label: 'Tình trạng ngoại hình' },
        { key: 'warranty', label: 'Gói bảo hành đi kèm' },
        { key: 'box', label: 'Phụ kiện trong hộp' }
    ];

    let rowsHTML = '';
    compareFeatures.forEach(feature => {
        rowsHTML += `<tr>`;
        rowsHTML += `<td class="comparison-feature-col">${feature.label}</td>`;
        selectedProds.forEach(p => {
            rowsHTML += `<td>${p.specs[feature.key]}</td>`;
        });
        rowsHTML += `</tr>`;
    });

    tableWrapper.innerHTML = `
        <table class="comparison-table">
            <thead>
                <tr>${headersHTML}</tr>
            </thead>
            <tbody>
                ${rowsHTML}
            </tbody>
        </table>
    `;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeCompareModal() {
    const modal = document.getElementById('compare-modal');
    if (!modal) return;
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function initCompareSystem() {
    const trigger = document.getElementById('compare-trigger-btn');
    const closeBtn = document.getElementById('close-compare-modal');
    
    if (trigger) trigger.addEventListener('click', launchComparatorModal);
    if (closeBtn) closeBtn.addEventListener('click', closeCompareModal);
    
    document.getElementById('compare-modal').addEventListener('click', (e) => {
        if(e.target.id === 'compare-modal') {
            closeCompareModal();
        }
    });
}

// --- Installment Form ---
function selectFormModel(productId) {
    const prod = state.products.find(p => p.id === productId);
    const select = document.getElementById('preferred-phone');
    if(select && prod) {
        select.value = prod.id;
        // Trigger select change event
        const event = new Event('change');
        select.dispatchEvent(event);
    }
}

function initInstallmentForm() {
    const form = document.getElementById('installment-form');
    const modelSelect = document.getElementById('preferred-phone');
    const termSelect = document.getElementById('installment-term');
    const paymentCalcInfo = document.getElementById('payment-calc-info');

    if (!form || !modelSelect) return;

    modelSelect.innerHTML = '';
    state.products.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = `${p.name.split(' - ')[0]} (${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)})`;
        modelSelect.appendChild(option);
    });

    function updateCalculations() {
        const prod = state.products.find(p => p.id === modelSelect.value);
        const term = parseInt(termSelect.value);
        
        if(prod && term) {
            const results = calculateInstallment(prod.price, term);
            const formatMonthly = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(results.monthlyTotal);
            const formatConversion = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(results.conversionFee);
            
            paymentCalcInfo.innerHTML = `
                <div style="background: rgba(255, 107, 0, 0.05); border: 1px solid rgba(255, 107, 0, 0.2); border-radius: 12px; padding: 14px; margin-top: 10px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom: 6px; font-size: 0.85rem; color: var(--text-secondary);">
                        <span>Góp mỗi tháng:</span>
                        <strong style="color:var(--primary); font-size: 1rem;">${formatMonthly} / tháng</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size: 0.8rem; color: var(--text-muted);">
                        <span>Lãi suất:</span>
                        <span style="color:#10B981; font-weight:700;">0% Hỗ trợ</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
                        <span>Phí dịch vụ hồ sơ:</span>
                        <span>${formatConversion} (đã bao gồm)</span>
                    </div>
                </div>
            `;
        }
    }

    modelSelect.addEventListener('change', updateCalculations);
    termSelect.addEventListener('change', updateCalculations);
    
    updateCalculations();

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const customerName = document.getElementById('customer-name').value.trim();
        const customerPhone = document.getElementById('customer-phone').value.trim();
        const selectedModelId = modelSelect.value;
        const selectedTerm = termSelect.value;
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        
        if (customerName.length < 2) {
            showToast('⚠️ Thiếu thông tin', 'Vui lòng điền họ tên đầy đủ.', 'info');
            return;
        }
        if (!phoneRegex.test(customerPhone)) {
            showToast('⚠️ Lỗi số điện thoại', 'Số điện thoại chưa đúng định dạng. VD: 0987654321', 'info');
            return;
        }

        const selectedProduct = state.products.find(p => p.id === selectedModelId);
        const payload = {
            customerName: customerName,
            phone: customerPhone,
            productId: selectedModelId,
            productName: selectedProduct.name,
            price: selectedProduct.price,
            installmentTerm: selectedTerm + ' tháng',
            monthlyPayment: calculateInstallment(selectedProduct.price, parseInt(selectedTerm)).monthlyTotal
        };

        const submitBtn = form.querySelector('.form-submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang gửi đăng ký...';

        try {
            const response = await mockDB.insertLead(payload);
            if (response.success) {
                showToast('🎉 Đăng ký thành công', `Hồ sơ trả góp của anh/chị ${customerName} đã được đồng bộ.`, 'success');
                showVietQRModal(payload);
                form.reset();
                updateCalculations();
            }
        } catch (error) {
            showToast('❌ Lỗi kết nối', 'Không thể kết nối với máy chủ. Vui lòng thử lại.', 'info');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Gửi Đăng Ký Tư Vấn';
        }
    });
}

function showVietQRModal(leadData) {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.id = 'qr-modal';
    
    const depositAmount = 500000; 
    const desc = `DAT COC ${leadData.customerName.toUpperCase()} ${leadData.phone}`;
    const qrUrl = generateVietQR(depositAmount, desc);
    const formatDeposit = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(depositAmount);

    modal.innerHTML = `
        <div class="modal-container" style="max-width: 500px;">
            <button class="modal-close" onclick="document.getElementById('qr-modal').remove()">✕</button>
            <div class="modal-body" style="text-align: center;">
                <div style="font-size: 3rem; color: #10B981; margin-bottom: 12px;">✓</div>
                <h3 style="font-size: 1.5rem; margin-bottom: 12px;">Hồ Sơ Của Bạn Đã Được Ghi Nhận!</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 24px;">
                    Thông tin của <strong>${leadData.customerName}</strong> đã được đồng bộ thành công lên CRM Anh Táo Mobile.
                </p>
                <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 16px; padding: 20px; margin-bottom: 24px;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">ĐĂNG KÝ CỌC GIỮ MÁY CƯỜNG LỰC</div>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 16px;">
                        Quét mã VietQR Techcombank dưới đây để đặt cọc trước giữ máy <strong>${formatDeposit}</strong> (Hoàn cọc 100% nếu duyệt không đạt).
                    </p>
                    <img src="${qrUrl}" alt="VietQR Techcombank" style="max-width: 220px; border-radius: 12px; border: 4px solid #fff; margin: 0 auto 12px auto; display: block;">
                    <div style="font-weight: 700; color: var(--primary); font-size: 0.95rem;">ANH TÁO MOBILE</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">Nội dung CK: <strong>${desc}</strong></div>
                </div>
                <button class="btn btn-primary" style="width: 100%;" onclick="document.getElementById('qr-modal').remove()">
                    Xác nhận hoàn tất
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

// --- Repair service Estimator ---
function initRepairEstimator() {
    // Estimator pricing calculations are handled locally using dynamically synced repairs
    calculateRepairCost();
}

function calculateRepairCost() {
    const modelSelect = document.getElementById('repair-phone-model');
    const serviceSelect = document.getElementById('repair-service-type');
    const panel = document.getElementById('repair-result-panel');

    if (!modelSelect || !panel) return;

    const model = modelSelect.value;
    const service = serviceSelect.value;

    // Query repairs from dynamically synced state array
    const record = state.repairs.find(r => r.device_model === model && r.service_type === service);

    if (record) {
        const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.price);
        panel.innerHTML = `
            <div style="background: rgba(0, 240, 255, 0.04); border: 1px solid rgba(0, 240, 255, 0.2); border-radius: 20px; padding: 24px; position:relative; overflow:hidden;">
                <div style="font-size: 0.8rem; color: var(--accent-blue); font-weight: 800; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 1px;">Ước tính chi phí</div>
                <div style="font-size: 2.2rem; font-weight: 800; color: var(--accent-blue); margin-bottom: 16px;">${formatPrice}</div>
                
                <div style="display:flex; flex-direction:column; gap:10px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px;">
                    <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                        <span style="color:var(--text-secondary);">Thời gian xử lý:</span>
                        <strong style="color:#fff;">${record.duration} (Lấy ngay)</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                        <span style="color:var(--text-secondary);">Thời hạn bảo hành linh kiện:</span>
                        <strong style="color:#10B981;">${record.warranty} Lỗi 1 Đổi 1</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                        <span style="color:var(--text-secondary);">Bảo hiểm linh kiện:</span>
                        <span style="color:var(--text-muted);">Cam kết linh kiện zin bóc máy / Pisen nhập khẩu</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// --- Used Catalog ---
function initUsedCatalog() {
    renderUsedCatalog();
}

function renderUsedCatalog() {
    const grid = document.getElementById('cu-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const usedProducts = state.products.filter(p => p.category === 'used');

    usedProducts.forEach(p => {
        const isSelected = state.selectedCompareIds.includes(p.id);
        const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price);
        const formatOriginal = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.originalPrice);

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-tag"><span class="badge badge-primary">${p.badge}</span></div>
            <div class="product-img-container">
                <img src="${p.image}" class="product-img" alt="${p.name}">
            </div>
            <div class="product-body">
                <a href="iphone-detail.html" class="product-title">${p.name}</a>
                <div class="product-meta-row">
                    <div class="product-rating">★ 4.9 <span>(200+)</span></div>
                    <div style="color:var(--accent-blue); font-size:0.8rem;">✓ 15-Steps Passed</div>
                </div>
                <div class="product-specs-brief">
                    <span class="spec-pill">${p.specs.screen}</span>
                    <span class="spec-pill">${p.specs.battery.split(': ')[1] || p.specs.battery}</span>
                </div>
                <div class="product-footer">
                    <div class="product-price-block">
                        <span class="original-price">${formatOriginal}</span>
                        <span class="sale-price">${formatPrice}</span>
                    </div>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-icon-only compare-toggle-btn ${isSelected ? 'active' : ''}" 
                                onclick="toggleComparison('${p.id}')" 
                                style="${isSelected ? 'background: var(--primary); color: #fff;' : ''}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                            </svg>
                        </button>
                        <button class="btn-icon-only" onclick="addToCart('${p.name}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- Tech News Hub ---
function initNewsHub() {
    renderNewsHub();
}

function renderNewsHub() {
    const grid = document.querySelector('.product-grid');
    if (!grid || !state.blogs || state.blogs.length === 0) return;
    grid.innerHTML = '';

    state.blogs.forEach(blog => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.padding = '0';
        card.style.overflow = 'hidden';
        
        let badgeColorClass = 'badge-primary';
        if (blog.category === 'Đánh Giá Chi Tiết') {
            badgeColorClass = 'badge-blue';
        } else if (blog.category === 'Quy Trình Sửa Chữa') {
            badgeColorClass = 'badge-primary';
        }

        card.innerHTML = `
            <div style="height: 180px; overflow:hidden; position:relative;">
                <img src="${blog.thumbnail_url}" style="width:100%; height:100%; object-fit:cover;">
                <span class="badge ${badgeColorClass}" style="position:absolute; top:12px; left:12px; z-index:2;">${blog.category}</span>
            </div>
            <div style="padding: 24px;">
                <span style="font-size:0.8rem; color:var(--text-muted);">Đăng ngày ${blog.published_date}</span>
                <h3 style="font-size: 1.15rem; font-weight:700; margin: 10px 0 14px 0; line-height: 1.3;">
                    <a href="#article-${blog.id}" style="color:#fff; text-decoration:none;" onclick="readDynamicArticle('${blog.id}')">${blog.title}</a>
                </h3>
                <p style="color:var(--text-secondary); font-size:0.85rem; margin-bottom: 20px;">${blog.brief}</p>
                <button class="btn btn-secondary" onclick="readDynamicArticle('${blog.id}')" style="padding: 8px 16px; font-size:0.8rem; width:100%;">Đọc tiếp bài viết</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Open Dynamic article reader popup
function readDynamicArticle(blogId) {
    const blog = state.blogs.find(b => b.id == blogId);
    if (!blog) return;

    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.id = 'art-modal';
    modal.innerHTML = `
        <div class="modal-container" style="max-width: 650px;">
            <button class="modal-close" onclick="document.getElementById('art-modal').remove()">✕</button>
            <div class="modal-body" style="line-height:1.7;">
                <h2 style="font-size: 1.5rem; font-weight:800; margin-bottom: 20px; color:var(--primary);">${blog.title}</h2>
                <p style="white-space: pre-line; color:var(--text-secondary); font-size:0.95rem;">${blog.content}</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Bind to window to allow global inline calls from catalog anchor cards
window.readDynamicArticle = readDynamicArticle;
window.calculateRepairCost = calculateRepairCost;
window.selectFormModel = selectFormModel;
window.toggleComparison = toggleComparison;
window.addToCart = addToCart;

// --- Theme Toggle Manager ---
function initThemeToggle() {
    // 1. Check existing user preference or default to dark
    const currentTheme = localStorage.getItem('vibemobile_theme') || 'dark';
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    }

    // 2. Create the floating button element
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'floating-btn floating-theme-toggle';
    toggleBtn.id = 'theme-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Chuyển đổi giao diện sáng/tối');
    
    // Set initial icon (sun for dark theme, moon for light theme)
    toggleBtn.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
    
    // Position the floating button inside the floating widget group or absolute floating
    const widgetGroup = document.querySelector('.floating-widget-group');
    if (widgetGroup) {
        // Prepend so it is at the top of the group
        widgetGroup.prepend(toggleBtn);
    } else {
        // If not widget group (like on admin page), style it absolutely at the bottom right
        toggleBtn.style.position = 'fixed';
        toggleBtn.style.bottom = '20px';
        toggleBtn.style.right = '20px';
        toggleBtn.style.zIndex = '99999';
        toggleBtn.style.width = '52px';
        toggleBtn.style.height = '52px';
        toggleBtn.style.borderRadius = '50%';
        toggleBtn.style.background = 'var(--primary-gradient)';
        toggleBtn.style.border = 'none';
        toggleBtn.style.color = '#fff';
        toggleBtn.style.fontSize = '1.3rem';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.display = 'flex';
        toggleBtn.style.alignItems = 'center';
        toggleBtn.style.justifyContent = 'center';
        toggleBtn.style.boxShadow = 'var(--shadow-premium)';
        toggleBtn.style.transition = 'var(--transition-bounce)';
        
        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.transform = 'scale(1.1) translateY(-3px)';
        });
        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.transform = 'none';
        });
        
        document.body.appendChild(toggleBtn);
    }

    // 3. Add event listener to toggle theme
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem('vibemobile_theme', isLight ? 'light' : 'dark');
        toggleBtn.innerHTML = isLight ? '🌙' : '☀️';
        
        showToast(
            isLight ? '☀️ Giao diện Sáng' : '🌙 Giao diện Tối', 
            `Đã chuyển sang chế độ nền ${isLight ? 'sáng' : 'tối'}.`, 
            'success'
        );
    });
}
window.initThemeToggle = initThemeToggle;
