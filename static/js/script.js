/* ============================================================
   STEELFIT — script.js
   ============================================================ */

'use strict';

/* ── Navbar Scroll Behaviour ── */
const navbar = document.querySelector('.navbar');
if (navbar) {
    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ── Hamburger / Mobile Menu ── */
const hamburger = document.querySelector('.navbar__hamburger');
const mobileMenu = document.querySelector('.navbar__mobile');
if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    mobileMenu.querySelectorAll('.navbar__mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* ── Scroll-Triggered Animations ── */
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-animate]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.dataset.delay || 0;
                setTimeout(() => {
                    el.classList.add('animated');
                    const animClass = el.dataset.animate;
                    if (animClass) el.style.animation = `${animClass} 0.7s cubic-bezier(0.4,0,0.2,1) forwards`;
                    el.style.opacity = '1';
                }, delay * 1000);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    elements.forEach(el => observer.observe(el));
}

/* ── Active Navbar Link ── */
function setActiveNavLink() {
    const path = window.location.pathname;
    document.querySelectorAll('.navbar__link').forEach(link => {
        const href = link.getAttribute('href') || '';
        link.classList.toggle('active', path === href || (href !== '/' && path.startsWith(href)));
    });
}

/* ── Product Search + Filter (products.html) ── */
function initProductFilter() {
    const searchInput = document.getElementById('productSearch');
    const sortSelect = document.getElementById('productSort');
    const categoryCheckboxes = document.querySelectorAll('.filter-category');
    const priceRange = document.getElementById('priceRange');
    const priceDisplay = document.getElementById('priceDisplay');
    const productCards = document.querySelectorAll('.product-card[data-name]');
    const countEl = document.getElementById('productCount');

    if (!productCards.length) return;

    function filterProducts() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const maxPrice = priceRange ? parseInt(priceRange.value) : Infinity;

        const checkedCats = [];
        categoryCheckboxes.forEach(cb => {
            if (cb.checked) checkedCats.push(cb.value);
        });

        let visible = 0;
        const cardArray = Array.from(productCards);

        cardArray.forEach(card => {
            const name = (card.dataset.name || '').toLowerCase();
            const categories = (card.dataset.category || '').toLowerCase().split(',');
            const price = parseInt(card.dataset.price || '0');

            const matchSearch = !query || name.includes(query) || categories.join(' ').includes(query);
            const matchPrice = price <= maxPrice;
            const matchCat = !checkedCats.length || checkedCats.some(cat => categories.includes(cat));

            const show = matchSearch && matchPrice && matchCat;
            card.style.display = show ? '' : 'none';
            card.style.opacity = show ? '' : '0';
            if (show) visible++;
        });

        // Sort
        if (sortSelect) {
            const grid = productCards[0].parentElement;
            const sorted = cardArray.filter(c => c.style.display !== 'none');
            const sortVal = sortSelect.value;
            if (sortVal === 'price-asc') {
                sorted.sort((a, b) => parseInt(a.dataset.price) - parseInt(b.dataset.price));
            } else if (sortVal === 'price-desc') {
                sorted.sort((a, b) => parseInt(b.dataset.price) - parseInt(a.dataset.price));
            } else if (sortVal === 'name-asc') {
                sorted.sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
            }
            sorted.forEach(card => grid.appendChild(card));
        }

        if (countEl) countEl.textContent = visible;
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            filterProducts();
        });
    }

    if (priceRange && priceDisplay) {
        priceRange.addEventListener('input', () => {
            priceDisplay.textContent = `₹${parseInt(priceRange.value).toLocaleString()}`;
            filterProducts();
        });
    }

    categoryCheckboxes.forEach(cb => cb.addEventListener('change', filterProducts));
    if (sortSelect) sortSelect.addEventListener('change', filterProducts);

    // Clear filters
    const clearBtn = document.querySelector('.filters-clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (priceRange) { priceRange.value = priceRange.max; if (priceDisplay) priceDisplay.textContent = `₹${parseInt(priceRange.max).toLocaleString()}`; }
            categoryCheckboxes.forEach(cb => cb.checked = false);
            if (sortSelect) sortSelect.value = 'default';
            filterProducts();
        });
    }
}

/* ── Product Gallery (product_detail.html) ── */
// function initProductGallery() {
//     const thumbs = document.querySelectorAll('.product-detail__thumb');
//     const mainImg = document.querySelector('.product-detail__main-image-placeholder');

//     if (!thumbs.length || !mainImg) return;

//     thumbs.forEach(thumb => {
//         thumb.addEventListener('click', () => {
//             thumbs.forEach(t => t.classList.remove('active'));
//             thumb.classList.add('active');
//             // animate swap
//             mainImg.style.opacity = '0';
//             mainImg.style.transform = 'scale(0.96)';
//             setTimeout(() => {
//                 mainImg.textContent = thumb.dataset.icon || mainImg.textContent;
//                 mainImg.style.opacity = '1';
//                 mainImg.style.transform = 'scale(1)';
//             }, 200);
//         });
//     });

//     if (thumbs[0]) thumbs[0].classList.add('active');
// }
function initProductGallery() {
    const gallery = document.querySelector('.product-detail__gallery');
    const mainImageWrapper = document.querySelector('.product-detail__main-image');
    if (!gallery || !mainImageWrapper) return;

    const getOrCreateMainImage = () => {
        let mainImg = mainImageWrapper.querySelector('#mainImage, img');
        if (mainImg) {
            mainImg.id = 'mainImage';
            if (!mainImg.style.transition) mainImg.style.transition = 'opacity 0.15s ease';
            return mainImg;
        }

        const placeholder = mainImageWrapper.querySelector('#mainImagePlaceholder, .product-detail__main-image-placeholder');
        if (placeholder) placeholder.remove();

        mainImg = document.createElement('img');
        mainImg.id = 'mainImage';
        mainImg.alt = 'Product image';
        mainImg.style.width = '100%';
        mainImg.style.height = '100%';
        mainImg.style.objectFit = 'cover';
        mainImg.style.transition = 'opacity 0.15s ease';
        mainImageWrapper.appendChild(mainImg);
        return mainImg;
    };

    const initialThumb = gallery.querySelector('.product-detail__thumb.active, .product-detail__thumb[data-image]');
    if (!mainImageWrapper.querySelector('img') && initialThumb) {
        const initialImage = initialThumb.getAttribute('data-image');
        if (initialImage) {
            const mainImg = getOrCreateMainImage();
            mainImg.src = initialImage;
            mainImg.style.opacity = '1';
        }
    }

    gallery.addEventListener('click', function (e) {
        const thumb = e.target.closest('.product-detail__thumb');
        if (!thumb) return;

        const newImage = thumb.getAttribute('data-image');
        if (!newImage) return;

        const mainImg = getOrCreateMainImage();
        mainImg.style.opacity = '0';

        setTimeout(() => {
            mainImg.src = newImage;
            mainImg.style.opacity = '1';
        }, 150);

        gallery.querySelectorAll('.product-detail__thumb')
            .forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
    });
}

/* ── Ticker Duplication (infinite scroll) ── */
function initTicker() {
    const track = document.querySelector('.ticker__track');
    if (!track) return;
    track.innerHTML += track.innerHTML; // duplicate for seamless loop
}

/* ── Auth Toggle (login ↔ register) ── */
function initAuthToggle() {
    const toggleLinks = document.querySelectorAll('[data-auth-toggle]');
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');

    if (!loginSection || !registerSection) return;

    toggleLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.authToggle;
            if (target === 'register') {
                loginSection.style.display = 'none';
                registerSection.style.display = 'block';
            } else {
                loginSection.style.display = 'block';
                registerSection.style.display = 'none';
            }
        });
    });
}

/* ── Profile Tab Navigation ── */
function initProfileTabs() {
    const navItems = document.querySelectorAll('.profile-nav-item[data-tab]');
    const tabPanels = document.querySelectorAll('.profile-tab-panel');

    if (!navItems.length) return;

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.dataset.tab;
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            tabPanels.forEach(panel => {
                panel.style.display = panel.id === targetTab ? 'block' : 'none';
            });
        });
    });

    // Show first tab
    if (navItems[0]) navItems[0].click();
}

/* ── Button Ripple Effect ── */
function initRipple() {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
        background:rgba(255,255,255,0.2);border-radius:50%;
        transform:scale(0);animation:ripple 0.5s ease-out forwards;
        pointer-events:none;
      `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 500);
        });
    });

    // Add ripple keyframe if not already
    if (!document.querySelector('#rippleStyle')) {
        const style = document.createElement('style');
        style.id = 'rippleStyle';
        style.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0;}}';
        document.head.appendChild(style);
    }
}

/* ── Wishlist / Quick-view Button Feedback ── */
function initProductActions() {
    document.querySelectorAll('.product-card__action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            btn.style.transform = 'scale(1.3)';
            setTimeout(() => btn.style.transform = '', 300);
        });
    });
}

/* ── Toast Notification ── */
function showToast(message, type = 'success') {
    const existing = document.querySelector('.sf-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'sf-toast';
    const colors = { success: '#4CAF84', error: '#E05252', info: '#456882' };
    toast.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    padding:16px 24px;border-radius:12px;
    background:rgba(13,31,45,0.95);backdrop-filter:blur(16px);
    border:1px solid ${colors[type] || colors.info}40;
    color:#F4EDE8;font-family:'Poppins',sans-serif;font-size:14px;
    box-shadow:0 8px 32px rgba(0,0,0,0.4);
    display:flex;align-items:center;gap:12px;
    transform:translateX(120%);transition:transform 0.35s cubic-bezier(0.4,0,0.2,1);
  `;
    const dot = `<span style="width:8px;height:8px;border-radius:50%;background:${colors[type]};flex-shrink:0;"></span>`;
    toast.innerHTML = `${dot}${message}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => toast.style.transform = 'translateX(0)');
    });

    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}
window.showToast = showToast;

/* ── Form Submission Intercept (demo feedback) ── */
function initFormFeedback() {
    document.querySelectorAll('form[data-feedback]').forEach(form => {
        form.addEventListener('submit', (e) => {
            const msg = form.dataset.feedback || 'Submitted successfully!';
            showToast(msg, 'success');
        });
    });
}

/* ── Floating Label Fix (for autofilled inputs) ── */
function fixFloatingLabels() {
    document.querySelectorAll('.form-group input').forEach(input => {
        if (input.value) input.classList.add('has-value');
        input.addEventListener('input', () => input.classList.toggle('has-value', !!input.value));
    });
}

/* ── Smooth Counter Animation ── */
function animateCounters() {
    document.querySelectorAll('[data-counter]').forEach(el => {
        const target = parseInt(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = target / 60;
        const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current) + suffix;
            if (current >= target) clearInterval(timer);
        }, 16);
    });
}

/* ── Page Load Animation ── */
function initPageLoad() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    window.addEventListener('load', () => {
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    });
}

/* ── Init ── */
function runInitializers() {
    initScrollAnimations();
    setActiveNavLink();
    initProductFilter();
    initProductGallery();
    initTicker();
    initAuthToggle();
    initProfileTabs();
    initRipple();
    initProductActions();
    initFormFeedback();
    fixFloatingLabels();

    // Counter animation on scroll
    const counterSection = document.querySelector('[data-counter-section]');
    if (counterSection) {
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) { animateCounters(); obs.disconnect(); }
        }, { threshold: 0.3 });
        obs.observe(counterSection);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInitializers);
} else {
    runInitializers();
}

initPageLoad();
