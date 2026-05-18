// =====================================================
// MAIN APPLICATION - FIXED VERSION
// =====================================================

let CONFIG_DATA = null;

// Cegah multiple initialization
let isInitialized = false;

document.addEventListener('dataLoaded', () => {
    if (isInitialized) return;
    isInitialized = true;
    
    CONFIG_DATA = getConfig();
    if (CONFIG_DATA) {
        initializeWithData();
        
        // Cek apakah di halaman pilih-paket
        if (window.location.pathname.includes('pilih-paket.html')) {
            updatePricingCards();
        }
    }
});

function initializeWithData() {
    initShippingOptions();
    initScrollAnimations();
    initNavigationHighlight();
    updateContactInfo();
    
    // Modal elements
    window.paymentModal = document.getElementById('paymentModal');
    window.shippingInfoModal = document.getElementById('shippingInfoModal');
}

// Fix untuk showSeaBankPayment dan showDanaPayment
window.showSeaBankPayment = function(packageName, price) {
    if (!CONFIG_DATA) return;
    
    // Handle format price (50K atau Rp 50K)
    let cleanPrice = price.replace('Rp ', '');
    
    const shipMethod = getSelectedShipping(packageName);
    const shipText = shipMethod === 'angin' ? 'RESI ANGIN (Tanpa kirim paket)' : 'RESI MANUAL (Kirim paket kosong ke CO)';
    
    const modalTitle = document.getElementById('paymentModalTitle');
    const modalBody = document.getElementById('paymentModalBody');
    
    if (modalTitle) modalTitle.innerHTML = `💰 Pembayaran Paket ${packageName.toUpperCase()}`;
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="bank-detail">
                <strong>🏦 ${CONFIG_DATA.seaBankAccount.bank} - Transfer Bank</strong><br/><br/>
                Nama Bank: <strong>${CONFIG_DATA.seaBankAccount.bank}</strong><br/>
                No. Rekening: <strong>${CONFIG_DATA.seaBankAccount.number}</strong><br/>
                Nama Penerima: <strong>${CONFIG_DATA.seaBankAccount.name}</strong><br/>
                <button class="copy-btn" onclick="copyToClipboard('${CONFIG_DATA.seaBankAccount.number}')">Salin No Rekening</button>
            </div>
            <p style="margin-top: 1.25rem;"><strong>Detail Pesanan:</strong><br/>
            Paket: ${packageName.toUpperCase()} (${cleanPrice})<br/>
            Metode Kirim: ${shipText}<br/>
            Total: <strong>${cleanPrice}</strong></p>
            <p style="margin-top: 1.25rem;">📌 <strong>Instruksi:</strong><br/>
            1. Transfer sesuai total ke rekening ${CONFIG_DATA.seaBankAccount.bank} di atas.<br/>
            2. Screenshot bukti transfer.<br/>
            3. Kirim bukti transfer ke WhatsApp admin.<br/>
            4. Proses FO akan dimulai setelah konfirmasi.</p>
            <button class="btn-primary" style="margin-top: 1.5rem; width:100%;" onclick="confirmPayment()">✅ Konfirmasi via WhatsApp</button>
        `;
    }
    if (window.paymentModal) window.paymentModal.style.display = 'flex';
};

window.showDanaPayment = function(packageName, price) {
    if (!CONFIG_DATA) return;
    
    let cleanPrice = price.replace('Rp ', '');
    
    const shipMethod = getSelectedShipping(packageName);
    const shipText = shipMethod === 'angin' ? 'RESI ANGIN (Tanpa kirim paket)' : 'RESI MANUAL (Kirim paket kosong ke CO)';
    
    const modalTitle = document.getElementById('paymentModalTitle');
    const modalBody = document.getElementById('paymentModalBody');
    
    if (modalTitle) modalTitle.innerHTML = `💰 Pembayaran via DANA`;
    if (modalBody) {
        modalBody.innerHTML = `
            <div class="bank-detail" style="text-align: center;">
                <strong>📱 DANA - Scan QR Code</strong><br/>
                <div style="background: white; padding: 1.25rem; border-radius: 18px; display: inline-block; margin: 1.25rem 0;">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DANA-${CONFIG_DATA.danaNumber}-ZETID" alt="QR Code DANA" style="width: 180px; height: 180px; border-radius: 10px;">
                </div>
                <p>atau kirim ke <strong>No. DANA: ${CONFIG_DATA.danaNumber}</strong></p>
                <button class="copy-btn" onclick="copyToClipboard('${CONFIG_DATA.danaNumber}')">Salin No DANA</button>
            </div>
            <p style="margin-top: 1.25rem;"><strong>Detail Pesanan:</strong><br/>
            Paket: ${packageName.toUpperCase()} (${cleanPrice})<br/>
            Metode Kirim: ${shipText}<br/>
            Total: <strong>${cleanPrice}</strong></p>
            <p style="margin-top: 1.25rem;">📌 <strong>Instruksi:</strong><br/>
            1. Scan QR DANA atau kirim ke No DANA di atas.<br/>
            2. Screenshot bukti pembayaran.<br/>
            3. Kirim bukti ke WhatsApp admin.<br/>
            4. Proses FO akan dimulai.</p>
            <button class="btn-primary" style="margin-top: 1.5rem; width:100%;" onclick="confirmPayment()">✅ Konfirmasi via WhatsApp</button>
        `;
    }
    if (window.paymentModal) window.paymentModal.style.display = 'flex';
};

window.closePaymentModal = function() {
    if (window.paymentModal) window.paymentModal.style.display = 'none';
};

window.closeShippingInfoModal = function() {
    if (window.shippingInfoModal) window.shippingInfoModal.style.display = 'none';
};

window.confirmPayment = function() {
    if (!CONFIG_DATA) return;
    const message = 'Halo ZET ID, saya sudah melakukan pembayaran. Mohon konfirmasi dan proses FO saya. Terima kasih.';
    window.open(`https://wa.me/${CONFIG_DATA.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    window.closePaymentModal();
};

window.openWhatsApp = function() {
    if (!CONFIG_DATA) return;
    window.open(`https://wa.me/${CONFIG_DATA.whatsappNumber}?text=${encodeURIComponent('Halo ZET ID, saya ingin konsultasi tentang jasa FO')}`, '_blank');
};

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Nomor berhasil disalin: ' + text);
    }).catch(() => {
        alert('Gagal menyalin. Silakan salin manual: ' + text);
    });
};

function getSelectedShipping(packageName) {
    const selected = document.querySelector(`#shipping-${packageName}-group .radio-option.selected`);
    return selected ? selected.dataset.ship : 'angin';
}

function initShippingOptions() {
    if (!CONFIG_DATA) return;
    
    CONFIG_DATA.packages.forEach(pkg => {
        const defaultOpt = document.querySelector(`#shipping-${pkg.id}-group .radio-option[data-ship="angin"]`);
        if(defaultOpt) {
            defaultOpt.classList.add('selected');
            const radio = defaultOpt.querySelector('input');
            if(radio) radio.checked = true;
        }
    });

    document.querySelectorAll('.radio-option').forEach(opt => {
        opt.addEventListener('click', function(e) {
            e.stopPropagation();
            const pkg = this.dataset.pkg;
            const container = document.querySelector(`#shipping-${pkg}-group`);
            if(container) container.querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            const radio = this.querySelector('input');
            if(radio) radio.checked = true;
        });
    });
}

function updatePricingCards() {
    const pricingGrid = document.querySelector('.pricing-grid');
    if (!pricingGrid || !CONFIG_DATA) return;
    
    pricingGrid.innerHTML = CONFIG_DATA.packages.map(pkg => `
        <div class="pricing-card ${pkg.isPopular ? 'popular' : ''}" data-package="${pkg.id}">
            <h3 class="pricing-name">${pkg.name}</h3>
            <p class="pricing-desc">${pkg.description}</p>
            <div class="pricing-price"><span class="price-value">${pkg.priceDisplay}</span><span class="price-unit">/paket</span></div>
            <div class="shipping-options">
                <div class="shipping-title"><span>📦 Pilih Metode Pengiriman:</span></div>
                <div class="radio-group" id="shipping-${pkg.id}-group">
                    <div class="radio-option selected" data-ship="angin" data-pkg="${pkg.id}">
                        <input type="radio" name="shipping-${pkg.id}" value="angin" id="${pkg.id}-angin" checked>
                        <label class="radio-label" for="${pkg.id}-angin">
                            <span class="radio-name"><span class="badge-angin">RESI ANGIN</span> 🚀</span>
                            <span class="radio-desc">Terima ulasan saja, TANPA kirim paket.</span>
                        </label>
                    </div>
                    <div class="radio-option" data-ship="manual" data-pkg="${pkg.id}">
                        <input type="radio" name="shipping-${pkg.id}" value="manual" id="${pkg.id}-manual">
                        <label class="radio-label" for="${pkg.id}-manual">
                            <span class="radio-name"><span class="badge-manual">RESI MANUAL</span> 📬</span>
                            <span class="radio-desc">Kirim paket kosong ke pembeli.</span>
                        </label>
                    </div>
                </div>
                <div class="shipping-info-buttons">
                    <a href="resi-angin.html" class="info-link-btn angin">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                        <span>Pelajari Resi Angin</span>
                    </a>
                    <a href="resi-manual.html" class="info-link-btn manual">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        <span>Pelajari Resi Manual</span>
                    </a>
                </div>
            </div>
            <div class="payment-methods">
                <div class="payment-title">💳 Metode Pembayaran:</div>
                <div class="payment-buttons">
                    <button class="payment-btn seabank" onclick="showSeaBankPayment('${pkg.id}', '${pkg.priceDisplay}')">🏦 SeaBank</button>
                    <button class="payment-btn dana" onclick="showDanaPayment('${pkg.id}', '${pkg.priceDisplay}')">📱 DANA</button>
                </div>
            </div>
            <ul class="pricing-features">
                ${pkg.features.map(f => `<li><span class="check-icon">✓</span> ${f}</li>`).join('')}
            </ul>
            <button class="pricing-btn ${pkg.isPopular ? 'primary' : 'secondary'}" onclick="showSeaBankPayment('${pkg.id}', '${pkg.priceDisplay}')">Pesan Sekarang</button>
        </div>
    `).join('');
    
    initShippingOptions();
    initScrollAnimations();
}

function updateContactInfo() {
    if (!CONFIG_DATA) return;
    const contactItems = document.querySelectorAll('.contact-item');
    if (contactItems.length >= 2) {
        contactItems[0].innerHTML = `📞 ${CONFIG_DATA.contact.phone}`;
        contactItems[1].innerHTML = `⏰ ${CONFIG_DATA.contact.hours}`;
    }
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.feature-card, .pricing-card, .step-item, .testimonial-card')
        .forEach(el => observer.observe(el));
}

function initNavigationHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if(scrollY >= sectionTop - 200) current = section.getAttribute('id');
        });
        navItems.forEach(item => {
            item.classList.remove('active');
            if(item.getAttribute('href') === '#' + current || 
               (item.getAttribute('href') === 'index.html' && current === 'beranda')) {
                item.classList.add('active');
            }
        });
    });
}

function scrollToHow() { 
    const el = document.getElementById('cara');
    if(el) el.scrollIntoView({ behavior: 'smooth' });
}

function scrollToContact() { 
    const el = document.getElementById('kontak');
    if(el) el.scrollIntoView({ behavior: 'smooth' });
}

function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebarNav');
    const overlay = document.getElementById('sidebarOverlay');
    if(sidebar) sidebar.classList.toggle('mobile-open');
    if(overlay) overlay.classList.toggle('active');
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebarNav');
    const overlay = document.getElementById('sidebarOverlay');
    if(sidebar) sidebar.classList.remove('mobile-open');
    if(overlay) overlay.classList.remove('active');
}

function detectAndSetVideo() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    
    const desktopVideo = document.querySelector('.desktop-video');
    const mobileVideo = document.querySelector('.mobile-video');
    
    if (isMobile) {
        if (desktopVideo) desktopVideo.style.display = 'none';
        if (mobileVideo) {
            mobileVideo.style.display = 'block';
            mobileVideo.muted = true;
            mobileVideo.play().catch(e => console.log('Auto-play prevented:', e));
        }
    } else {
        if (desktopVideo) {
            desktopVideo.style.display = 'block';
            desktopVideo.muted = true;
            desktopVideo.play().catch(e => console.log('Auto-play prevented:', e));
        }
        if (mobileVideo) mobileVideo.style.display = 'none';
    }
}

// Run on load
document.addEventListener('DOMContentLoaded', function() {
    detectAndSetVideo();
    
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(detectAndSetVideo, 250);
    });
});

window.onclick = function(e) {
    if(e.target === window.paymentModal) window.closePaymentModal();
    if(e.target === window.shippingInfoModal) window.closeShippingInfoModal();
};