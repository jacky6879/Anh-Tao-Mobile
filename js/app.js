/**
 * app.js - Main Application Controller (Anh Táo Mobile)
 * Handles visual interactions, sliders, catalog filters, specs comparator,
 * 15-step quality audit panels, validation logic, and cart notifications.
 */

// 1. Core Product Database (Clean JSON structure for high performance)
const PRODUCTS = [
    // --- NEW PHONES (Tab: new) ---
    {
        id: 'new_ip15promax',
        name: 'iPhone 15 Pro Max 256GB - Chính hãng VNA',
        category: 'new',
        price: 29490000,
        originalPrice: 34990000,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600', // Premium Phone Stock
        rating: 5.0,
        reviews: 142,
        specs: {
            screen: '6.7 inches, Super Retina XDR OLED, 120Hz',
            cpu: 'Apple A17 Pro (3nm)',
            ram: '8 GB',
            storage: '256 GB',
            battery: '100% (Mới tinh - 4441 mAh)',
            box: 'Fullbox, cáp sạc zin, sách hướng dẫn, nguyên seal',
            warranty: '12 tháng chính hãng Apple Việt Nam',
            condition: 'Mới 100% nguyên seal'
        },
        badge: 'Bán chạy nhất'
    },
    {
        id: 'new_s24ultra',
        name: 'Samsung Galaxy S24 Ultra 256GB',
        category: 'new',
        price: 26990000,
        originalPrice: 33990000,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600',
        rating: 4.9,
        reviews: 98,
        specs: {
            screen: '6.8 inches, Dynamic AMOLED 2X, 120Hz',
            cpu: 'Snapdragon 8 Gen 3 for Galaxy',
            ram: '12 GB',
            storage: '256 GB',
            battery: '100% (Mới tinh - 5000 mAh)',
            box: 'Fullbox, cáp sạc Type-C zin, que chọc sim, nguyên seal',
            warranty: '12 tháng chính hãng Samsung Việt Nam',
            condition: 'Mới 100% nguyên seal'
        },
        badge: 'Giá hời'
    },
    {
        id: 'new_xiaomi14',
        name: 'Xiaomi 14 12GB/256GB - Chính Hãng VNA',
        category: 'new',
        price: 18490000,
        originalPrice: 22990000,
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=600',
        rating: 4.8,
        reviews: 45,
        specs: {
            screen: '6.36 inches, LTPO OLED, 120Hz, 3000 nits',
            cpu: 'Snapdragon 8 Gen 3',
            ram: '12 GB',
            storage: '256 GB',
            battery: '100% (Mới tinh - 4610 mAh)',
            box: 'Fullbox sạc nhanh 90W, ốp lưng zin, cáp Type-C',
            warranty: '18 tháng chính hãng Xiaomi Việt Nam',
            condition: 'Mới 100% nguyên seal'
        },
        badge: 'Công nghệ mới'
    },

    // --- USED PHONES (Tab: used) ---
    {
        id: 'used_ip14promax',
        name: 'iPhone 14 Pro Max 256GB - Like New 99%',
        category: 'used',
        price: 21290000,
        originalPrice: 28990000,
        image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=600', // Matches phone styles
        rating: 4.9,
        reviews: 320,
        specs: {
            screen: '6.7 inches, Super Retina XDR, 120Hz',
            cpu: 'Apple A16 Bionic (4nm)',
            ram: '6 GB',
            storage: '256 GB',
            battery: 'Cam kết > 89% (Chưa chai pin)',
            box: 'Cáp sạc cao cấp, tặng kèm ốp chống sốc & cường lực',
            warranty: '06 tháng AnhTáoCare bảo hành cả nguồn, màn hình',
            condition: 'Đẹp 99% không cấn móp, zin áp suất'
        },
        badge: 'Kiểm định 15 bước'
    },
    {
        id: 'used_ip13pro',
        name: 'iPhone 13 Pro 128GB - Like New 99%',
        category: 'used',
        price: 13990000,
        originalPrice: 19990000,
        image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=600',
        rating: 4.8,
        reviews: 185,
        specs: {
            screen: '6.1 inches, Super Retina XDR OLED, 120Hz',
            cpu: 'Apple A15 Bionic',
            ram: '6 GB',
            storage: '128 GB',
            battery: 'Cam kết > 88% (Zin nguyên bản)',
            box: 'Cáp sạc cao cấp, tặng cường lực & ốp chống sốc',
            warranty: '06 tháng AnhTáoCare toàn diện',
            condition: 'Ngoại hình 98.5% - 99%, zin 100%'
        },
        badge: 'Bao test 30 ngày'
    },
    {
        id: 'used_s23ultra',
        name: 'Samsung Galaxy S23 Ultra 256GB - 99%',
        category: 'used',
        price: 16490000,
        originalPrice: 24990000,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600',
        rating: 4.9,
        reviews: 112,
        specs: {
            screen: '6.8 inches, QHD+ Dynamic AMOLED 2X, 120Hz',
            cpu: 'Snapdragon 8 Gen 2 for Galaxy',
            ram: '8 GB',
            storage: '256 GB',
            battery: 'Độ chai thấp - dung lượng thực tế > 90%',
            box: 'Cáp sạc Type-C cao cấp, bút S-Pen đi kèm máy',
            warranty: '06 tháng lỗi đổi mới tuần đầu',
            condition: 'Mặt kính đẹp, viền xước nhẹ dăm 98.5%'
        },
        badge: 'Được săn đón'
    },

    // --- ACCESSORIES (Tab: accessory) ---
    {
        id: 'acc_charger20w',
        name: 'Sạc nhanh Apple 20W USB-C Power Adapter',
        category: 'accessory',
        price: 490000,
        originalPrice: 690000,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=600',
        rating: 5.0,
        reviews: 2100,
        specs: {
            screen: 'Không có',
            cpu: 'Không có',
            ram: 'Không có',
            storage: 'Nguồn ra: 20W Power Delivery',
            battery: 'An toàn chống quá dòng, chống nhiệt',
            box: 'Củ sạc, sách hướng dẫn sử dụng',
            warranty: '12 tháng đổi mới nếu lỗi nhà sản xuất',
            condition: 'Hàng chính hãng bóc máy / nguyên hộp'
        },
        badge: 'Bắt buộc mua'
    },
    {
        id: 'acc_magsafe10k',
        name: 'Pin sạc dự phòng MagSafe Hoco 10000mAh',
        category: 'accessory',
        price: 550000,
        originalPrice: 850000,
        image: 'https://images.unsplash.com/photo-1609592424085-f5b2255b8823?auto=format&fit=crop&q=80&w=600',
        rating: 4.7,
        reviews: 320,
        specs: {
            screen: 'Đèn LED báo pin',
            cpu: 'Không có',
            ram: 'Không có',
            storage: 'Dung lượng: 10.000 mAh',
            battery: 'Lõi pin Li-Polymer siêu bền',
            box: 'Hộp sạc, cáp sạc đi kèm',
            warranty: '06 tháng lỗi 1 đổi 1',
            condition: 'Mới 100% nguyên hộp sành điệu'
        },
        badge: 'Được mua kèm nhiều'
    }
];

// 2. Global Application State
const state = {
    activeCategory: 'new',
    selectedCompareIds: [],
    cartCount: 0,
    currentHeroSlide: 0
};

// 3. UI Controller Handlers
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHeroSlider();
    initCatalog();
    initQCSection();
    initForms();
    initCompareSystem();
    initScrollEffects();
});

// --- Scroll Effects & Layout Headers ---
function initScrollEffects() {
    const header = document.querySelector('header');
    const backToTop = document.querySelector('.floating-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- Menu Drawers & Navigation Links ---
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        menuToggle.classList.toggle('active');
        
        // Dynamic burger line transitions
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

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            menuToggle.classList.remove('active');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// --- Dynamic Hero Slider logic ---
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const bullets = document.querySelectorAll('.hero-bullet');
    const bulletContainer = document.querySelector('.hero-bullets');
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        bullets.forEach(bullet => bullet.classList.remove('active'));

        slides[index].classList.add('active');
        bullets[index].classList.add('active');
        state.currentHeroSlide = index;
    }

    function nextSlide() {
        let index = (state.currentHeroSlide + 1) % slides.length;
        showSlide(index);
    }

    // Set automatic slide interval
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

    // Touch events for mobile swiping
    let startX = 0;
    const sliderContainer = document.querySelector('.hero');
    
    sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
        let diffX = e.changedTouches[0].clientX - startX;
        if (Math.abs(diffX) > 60) {
            clearInterval(slideInterval);
            if (diffX > 0) { // Swipe right -> prev
                let index = (state.currentHeroSlide - 1 + slides.length) % slides.length;
                showSlide(index);
            } else { // Swipe left -> next
                let index = (state.currentHeroSlide + 1) % slides.length;
                showSlide(index);
            }
            startInterval();
        }
    }, { passive: true });

    showSlide(0);
    startInterval();
}

// --- Product Catalog Render & Interactions ---
function initCatalog() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const productGrid = document.querySelector('.product-grid');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            state.activeCategory = category;
            
            renderProducts(category);
        });
    });

    // Initial render
    renderProducts('new');
}

function renderProducts(category) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';

    const filtered = PRODUCTS.filter(p => p.category === category);

    filtered.forEach(p => {
        const isCompareSelected = state.selectedCompareIds.includes(p.id);
        const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price);
        const formatOriginal = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.originalPrice);

        const card = document.createElement('div');
        card.className = `product-card`;
        card.dataset.id = p.id;
        
        // Built specs preview lists
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
                <a href="#installment-form" class="product-title" onclick="selectFormModel('${p.id}')">${p.name}</a>
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

        // Card mouse move gradient lighting trigger
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

// --- Cart Notification simulation ---
function addToCart(productName) {
    state.cartCount++;
    document.querySelector('.cart-badge').textContent = state.cartCount;
    
    showToast('🛒 Giỏ hàng cập nhật', `${productName} đã được thêm vào giỏ hàng của bạn.`, 'success');
}

// --- Global Dynamic Notification Alerts ---
function showToast(title, desc, type = 'info') {
    const container = document.getElementById('toast-container');
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
    
    // Animate display
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// --- Dynamic 15-Step Quality Check visualizer ---
const QC_STEPS = [
    {
        num: 'Bước 01',
        title: 'Thẩm định ngoại hình & Vỏ máy',
        desc: 'Kiểm tra trầy xước viền, cấn móp vỏ, phát hiện nứt vỡ bằng kính hiển vi chuyên dụng.'
    },
    {
        num: 'Bước 04',
        title: 'Hiệu suất & Sức khỏe Pin',
        desc: 'Kiểm tra chu kỳ sạc, đo dòng sạc thực tế, cam kết hiệu suất dung lượng đạt chuẩn tốt nhất (>88%).'
    },
    {
        num: 'Bước 08',
        title: 'Màn hình cảm ứng & Lớp hiển thị',
        desc: 'Chạy phổ quang kiểm tra điểm chết, ám ố màn, phản quang, đo độ trễ lớp cảm ứng điện dung.'
    },
    {
        num: 'Bước 12',
        title: 'Cụm Camera & Cảm biến quang',
        desc: 'Kiểm định chống rung quang học OIS, lấy nét Laser, quét cảm biến chiều sâu LiDAR và camera trước.'
    },
    {
        num: 'Bước 15',
        title: 'Kết nối mạng & Bảo mật Sinh trắc',
        desc: 'Đo cường độ sóng 5G/LTE, Wifi, test bảo mật vân tay Touch ID hoặc khuôn mặt Face ID hoạt động chính xác.'
    }
];

function initQCSection() {
    const listContainer = document.querySelector('.qc-steps-list');
    listContainer.innerHTML = '';

    QC_STEPS.forEach((step, idx) => {
        const item = document.createElement('div');
        item.className = `qc-step-card ${idx === 0 ? 'active' : ''}`;
        item.dataset.index = idx;
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
            
            // Re-trigger scanning visual effect on mobile mockup
            const ray = document.querySelector('.qc-scanner-ray');
            ray.style.animation = 'none';
            // Trigger reflow to restart animation
            void ray.offsetWidth;
            ray.style.animation = 'scanRay 4s ease-in-out infinite';
            
            showToast('🔍 Đang kiểm định kĩ thuật', `Đang quét mô phỏng: ${step.title}`, 'info');
        });

        listContainer.appendChild(item);
    });
}

// --- Product Specifications Comparator System ---
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
    
    // Update product card comparisons styling
    renderProducts(state.activeCategory);
    updateCompareBar();
}

function updateCompareBar() {
    const bar = document.getElementById('compare-bar');
    const list = document.querySelector('.compare-selected-list');
    
    if (state.selectedCompareIds.length === 0) {
        bar.classList.remove('show');
        return;
    }

    list.innerHTML = '';
    state.selectedCompareIds.forEach(id => {
        const prod = PRODUCTS.find(p => p.id === id);
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
    const tableWrapper = document.querySelector('.comparison-table-wrapper');
    
    if(state.selectedCompareIds.length === 0) return;

    // Build headers & parameters list
    const selectedProds = state.selectedCompareIds.map(id => PRODUCTS.find(p => p.id === id));
    
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
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

function initCompareSystem() {
    const trigger = document.getElementById('compare-trigger-btn');
    const closeBtn = document.getElementById('close-compare-modal');
    
    trigger.addEventListener('click', launchComparatorModal);
    closeBtn.addEventListener('click', closeCompareModal);
    
    // Close modal on click background
    document.getElementById('compare-modal').addEventListener('click', (e) => {
        if(e.target.id === 'compare-modal') {
            closeCompareModal();
        }
    });
}

// --- Customer registration forms & backend binding ---
function selectFormModel(productId) {
    const prod = PRODUCTS.find(p => p.id === productId);
    const select = document.getElementById('preferred-phone');
    if(select && prod) {
        select.value = prod.id;
    }
}

function initForms() {
    const form = document.getElementById('installment-form');
    
    // Dynamic calculation of installment prices on choice updates
    const modelSelect = document.getElementById('preferred-phone');
    const termSelect = document.getElementById('installment-term');
    const paymentCalcInfo = document.getElementById('payment-calc-info');

    // Popular models drop down binding
    modelSelect.innerHTML = '';
    PRODUCTS.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = `${p.name.split(' - ')[0]} (${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)})`;
        modelSelect.appendChild(option);
    });

    function updateCalculations() {
        const prod = PRODUCTS.find(p => p.id === modelSelect.value);
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
                        <span>Phí chuyển đổi hồ sơ (Techcombank):</span>
                        <span>${formatConversion} (đã bao gồm)</span>
                    </div>
                </div>
            `;
        }
    }

    modelSelect.addEventListener('change', updateCalculations);
    termSelect.addEventListener('change', updateCalculations);
    
    // Trigger first calc
    updateCalculations();

    // Form submission processing
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const customerName = document.getElementById('customer-name').value.trim();
        const customerPhone = document.getElementById('customer-phone').value.trim();
        const selectedModelId = modelSelect.value;
        const selectedTerm = termSelect.value;
        
        // Vietnamese Phone validation rule
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        
        if (customerName.length < 2) {
            showToast('⚠️ Thiếu thông tin', 'Vui lòng điền họ tên đầy đủ (ít nhất 2 kí tự).', 'info');
            return;
        }

        if (!phoneRegex.test(customerPhone)) {
            showToast('⚠️ Lỗi số điện thoại', 'Số điện thoại Việt Nam chưa đúng định dạng. VD: 0987654321', 'info');
            return;
        }

        // Gather payloads
        const selectedProduct = PRODUCTS.find(p => p.id === selectedModelId);
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
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang đồng bộ CRM...';

        try {
            // Save lead record in database mock proxy
            const response = await mockDB.insertLead(payload);
            
            if (response.success) {
                showToast('🎉 Đăng ký thành công', `Hồ sơ trả góp 0% của anh/chị ${customerName} đã được đồng bộ lên Google CRM. Nhân viên CSKH sẽ gọi lại trong 15 phút.`, 'success');
                
                // Show QR code modal for deposit/direct bank payments simulation
                showVietQRModal(payload);
                form.reset();
                updateCalculations();
            }
        } catch (error) {
            showToast('❌ Lỗi kết nối', 'Không thể đồng bộ với hệ thống Firebase. Vui lòng thử lại.', 'info');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// --- Bank Payment QR generator popup simulation ---
function showVietQRModal(leadData) {
    const modal = document.createElement('div');
    modal.className = 'modal show';
    modal.id = 'qr-modal';
    
    // Simulate minor reservation deposit
    const depositAmount = 500000; 
    const desc = `DAT COC ${leadData.customerName.toUpperCase()} ${leadData.phone}`;
    const qrUrl = generateVietQR(depositAmount, desc);
    const formatDeposit = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(depositAmount);

    modal.innerHTML = `
        <div class="modal-container" style="max-width: 500px;">
            <button class="modal-close" onclick="document.getElementById('qr-modal').remove()">✕</button>
            <div class="modal-body" style="text-align: center;">
                <div style="font-size: 3rem; color: #10B981; margin-bottom: 12px;">✓</div>
                <h3 style="font-size: 1.5rem; margin-bottom: 12px;">Tạo Hồ Sơ Trả Góp Thành Công!</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 24px;">
                    Hệ thống đã gửi thông tin đăng ký của <strong>${leadData.customerName}</strong> lên CRM Anh Táo Mobile.
                </p>
                <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 16px; padding: 20px; margin-bottom: 24px;">
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;">ĐĂNG KÝ GIỮ MÁY ƯU TIÊN</div>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 16px;">
                        Quét mã QR Techcombank dưới đây để đặt cọc trước giữ máy <strong>${formatDeposit}</strong> (Hoàn tiền 100% nếu duyệt trả góp không đạt).
                    </p>
                    <img src="${qrUrl}" alt="VietQR Techcombank Anh Táo Mobile" style="max-width: 220px; border-radius: 12px; border: 4px solid #fff; margin: 0 auto 12px auto; display: block;">
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
