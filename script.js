   // ---------- Product Data ----------
    const products = [
        { id: 1, name: "អាវយឺតបុរស", desc: "អាវយឺតកប្បាស 100% មានច្រើនពណ៌", price: 45000, category: "សម្លៀកបំពាក់", imageIcon: "fas fa-tshirt" },
        { id: 2, name: "កាបូបស្ពាយ", desc: "កាបូបស្ពាយទាន់សម័យ ធន់នឹងទឹក", price: 89000, category: "គ្រឿងបន្លាស់", imageIcon: "fas fa-bag-shopping" },
        { id: 3, name: "សៀវភៅរៀនកូដ", desc: "សៀវភៅ HTML, CSS, JS ភាសាខ្មែរ", price: 35000, category: "សៀវភៅ", imageIcon: "fas fa-book" },
        { id: 4, name: "នាឡិកាឆ្លាត", desc: "តាមដានសុខភាព និងកីឡា", price: 129000, category: "អេឡិចត្រូនិច", imageIcon: "fas fa-clock" },
        { id: 5, name: "កាហ្វេអង្ករ", desc: "កាហ្វេសុទ្ធ 500g ក្លិនឈ្ងុយ", price: 28000, category: "ម្ហូបអាហារ", imageIcon: "fas fa-mug-hot" },
        { id: 6, name: "ស្បែកជើងប៉ាក់", desc: "ស្បែកជើងកីឡារលាស់ស្រួល", price: 99000, category: "សម្លៀកបំពាក់", imageIcon: "fas fa-shoe-prints" },
        { id: 7, name: "ឆ័ត្របត់", desc: "ឆ័ត្របត់តូច ធន់ខ្យល់", price: 22000, category: "គ្រឿងបន្លាស់", imageIcon: "fas fa-umbrella" },
        { id: 8, name: "កាសស្តាប់តន្ត្រី", desc: "កាស Bluetooth សំឡេងច្បាស់", price: 65000, category: "អេឡិចត្រូនិច", imageIcon: "fas fa-headphones" }
    ];

    let cart = [];
    let currentPage = "home";
    let currentSearchTerm = "";

    // Helper functions
    function formatPrice(price) { return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
    function escapeHtml(str) { return str.replace(/[&<>]/g, function(m) { return m === '&' ? '&amp;' : m === '<' ? '&lt;' : '&gt;'; }); }
    
    function showToast(msg, isErr = false) {
        const toast = document.getElementById('toastMsg');
        toast.textContent = msg;
        toast.style.backgroundColor = isErr ? "#b91c1c" : "#1f452c";
        toast.style.opacity = "1";
        toast.style.transform = "translateX(-50%) scale(1)";
        setTimeout(() => { toast.style.opacity = "0"; toast.style.transform = "translateX(-50%) scale(0.9)"; }, 2000);
    }
    
    function saveCart() { localStorage.setItem('ecommerce_cart_khmer', JSON.stringify(cart)); updateCartUI(); }
    function loadCart() { const stored = localStorage.getItem('ecommerce_cart_khmer'); cart = stored ? JSON.parse(stored) : []; updateCartUI(); }
    
    function updateCartUI() { 
        const totalItems = cart.reduce((s,i)=> s + i.quantity,0);
        document.getElementById('cartCount').innerText = totalItems;
        renderCartSidebar();
    }
    
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if(!product) return;
        const existing = cart.find(i => i.id === productId);
        if(existing) existing.quantity += 1;
        else cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1, imageIcon: product.imageIcon });
        saveCart();
        showToast(`បានបន្ថែម ${product.name} ទៅកន្ត្រក`);
    }
    
    function removeCartItem(id) { cart = cart.filter(i => i.id !== id); saveCart(); }
    
    function updateQuantity(id, delta) {
        const item = cart.find(i => i.id === id);
        if(item) { item.quantity += delta; if(item.quantity <= 0) removeCartItem(id); else saveCart(); }
    }
    
    function renderCartSidebar() {
        const container = document.getElementById('cartItemsList');
        if(!container) return;
        if(cart.length === 0) { container.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-cart"></i> <br> កន្ត្រកនៅទទេ</div>`; document.getElementById('cartTotal').innerText = `0 ៛`; return; }
        let html = '', total = 0;
        cart.forEach(item => { const itemTotal = item.price * item.quantity; total += itemTotal;
            html += `<div class="cart-item" data-id="${item.id}"><div class="cart-item-img"><i class="${item.imageIcon}"></i></div><div class="cart-item-details"><div class="cart-item-title">${escapeHtml(item.name)}</div><div class="cart-item-price">${formatPrice(item.price)} ៛</div><div class="cart-item-qty"><button class="qty-btn" data-id="${item.id}" data-delta="-1">-</button><span>${item.quantity}</span><button class="qty-btn" data-id="${item.id}" data-delta="1">+</button><button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button></div></div><div style="font-weight:bold;">${formatPrice(itemTotal)} ៛</div></div>`;
        });
        container.innerHTML = html;
        document.getElementById('cartTotal').innerText = `${formatPrice(total)} ៛`;
        document.querySelectorAll('.qty-btn').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); updateQuantity(parseInt(btn.dataset.id), parseInt(btn.dataset.delta)); }));
        document.querySelectorAll('.remove-item').forEach(btn => btn.addEventListener('click', (e) => { e.stopPropagation(); removeCartItem(parseInt(btn.dataset.id)); }));
    }
    
    function openCart() { document.getElementById('cartSidebar').classList.add('open'); document.getElementById('cartOverlay').classList.add('open'); renderCartSidebar(); }
    function closeCart() { document.getElementById('cartSidebar').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('open'); }
    function checkout() { if(cart.length===0) showToast("កន្ត្រកទំនិញទទេ", true); else { showToast("សូមអរគុណ! ការបញ្ជាទិញរបស់អ្នកត្រូវបានទទួលយក។"); } }

    // ---------- Page Rendering (all content now properly centered inside .container) ----------
    function renderHomePage() {
        return `
            <div class="hero">
                <div class="hero-content">
                    <h1>ទិញទំនិញ <br>ស្រួលៗ គុណភាពខ្ពស់</h1>
                    <p>ស្វែងរកផលិតផលល្អៗ តម្លៃសមរម្យ និងការដឹកជញ្ជូនលឿនទូទាំងប្រទេសកម្ពុជា។</p>
                    <button class="btn-primary" id="exploreBtn"><i class="fas fa-bag-shopping"></i> ទិញឥឡូវ</button>
                </div>
                <div class="hero-img"><i class="fas fa-shopping-cart"></i></div>
            </div>
            <div class="section-title-wrapper">
                <h2 class="section-title">ផលិតផលពេញនិយម</h2>
            </div>
            <div class="products-grid" id="featuredGrid"></div>
        `;
    }
    
    function renderProductsPage(searchTerm = "") {
        let filtered = products;
        if(searchTerm) filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm) || p.desc.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm));
        const gridHtml = filtered.map(p => `
            <div class="product-card" data-id="${p.id}">
                <div class="product-img"><i class="${p.imageIcon}" style="font-size: 4rem;"></i></div>
                <div class="product-info">
                    <div class="product-title">${escapeHtml(p.name)}</div>
                    <div class="product-desc">${escapeHtml(p.desc)}</div>
                    <div class="price">${formatPrice(p.price)} ៛</div>
                    <button class="add-to-cart" data-id="${p.id}"><i class="fas fa-cart-plus"></i> បន្ថែមទៅកន្ត្រក</button>
                </div>
            </div>`).join('');
        return `
            <div class="section-title-wrapper">
                <h2 class="section-title">${searchTerm ? `លទ្ធផលស្វែងរក៖ "${escapeHtml(searchTerm)}"` : "ផលិតផលទាំងអស់"}</h2>
            </div>
            <div class="products-grid" id="allProductsGrid">${gridHtml || '<div style="grid-column:1/-1; text-align:center; padding:60px;">រកមិនឃើញផលិតផល</div>'}</div>
        `;
    }
    
    function renderAboutPage() {
        return `<div class="about-grid">
            <div class="about-text">
                <div class="section-title-wrapper"><h2 class="section-title" style="margin-top:0;">អំពីហាងទំនិញខ្មែរ</h2></div>
                <p>ស្វាគមន៍មកកាន់ហាងទំនិញខ្មែរ ដែលជាហាងអនឡាញឈានមុខគេក្នុងការផ្តល់ជូននូវផលិតផលប្រកបដោយគុណភាព និងតម្លៃសមរម្យសម្រាប់ប្រជាជនកម្ពុជា។</p>
                <p>យើងខ្ញុំប្តេជ្ញាចិត្តក្នុងការផ្តល់ជូនបទពិសោធន៍ទិញទំនិញតាមអនឡាញប្រកបដោយសុវត្ថិភាព រហ័ស និងទំនុកចិត្ត។</p>
                <div class="feature-item"><i class="fas fa-truck feature-icon"></i><div><strong>ដឹកជញ្ជូនលឿន</strong><br>ទូទាំងប្រទេសក្នុងរយៈពេល 2-3 ថ្ងៃ</div></div>
                <div class="feature-item"><i class="fas fa-shield-alt feature-icon"></i><div><strong>សុវត្ថិភាព 100%</strong><br>ការទូទាត់ និងទិន្នន័យត្រូវបានការពារ</div></div>
            </div>
            <div class="about-highlight">
                <h3>ហេតុអ្វីជ្រើសរើសយើង?</h3>
                <ul style="margin-left:20px; margin-top:16px;"><li>ផលិតផលមានគុណភាពខ្ពស់</li><li>តម្លៃប្រកួតប្រជែង</li><li>សេវាកម្មអតិថិជន ២៤/៧</li><li>ការដោះដូរស្រួលក្នុងរយៈពេល 7ថ្ងៃ</li></ul>
                <div class="social-links"><i class="fab fa-facebook"></i><i class="fab fa-instagram"></i><i class="fab fa-telegram"></i></div>
            </div>
        </div>`;
    }
    
    function renderContactPage() {
        return `<div class="contact-grid">
            <div class="contact-info">
                <div class="section-title-wrapper"><h2 class="section-title" style="margin-top:0;">ទំនាក់ទំនងមកយើង</h2></div>
                <p>យើងខ្ញុំសូមស្តាប់មតិកែលម្អ និងសំណួររបស់អ្នករាល់គ្នា។ សូមទំនាក់ទំនងមកតាមរយៈទម្រង់ខាងក្រោម ឬតាមរយៈបណ្តាញសង្គម។</p>
                <div class="feature-item"><i class="fas fa-map-marker-alt"></i><div>ភ្នំពេញ, កម្ពុជា</div></div>
                <div class="feature-item"><i class="fas fa-phone-alt"></i><div>+855 12 345 678</div></div>
                <div class="feature-item"><i class="fas fa-envelope"></i><div>support@khmershop.com</div></div>
                <div class="social-links"><i class="fab fa-facebook"></i><i class="fab fa-instagram"></i><i class="fab fa-telegram"></i></div>
            </div>
            <div class="contact-form">
                <h3>ផ្ញើសារមកពួកយើង</h3>
                <input type="text" placeholder="ឈ្មោះពេញ" id="contactName">
                <input type="email" placeholder="អ៊ីមែល" id="contactEmail">
                <textarea rows="4" placeholder="សាររបស់អ្នក..."></textarea>
                <button id="sendContactBtn"><i class="fas fa-paper-plane"></i> ផ្ញើសារ</button>
                <p style="font-size:0.8rem; margin-top:12px;">យើងនឹងឆ្លើយតបក្នុងរយៈពេល 24 ម៉ោង</p>
            </div>
        </div>`;
    }

    function loadPage(page, search = "") {
        currentPage = page;
        const dynamicDiv = document.getElementById('dynamicContent');
        let html = "";
        if(page === "home") html = renderHomePage();
        else if(page === "products") html = renderProductsPage(search);
        else if(page === "about") html = renderAboutPage();
        else if(page === "contact") html = renderContactPage();
        dynamicDiv.innerHTML = html;
        
        if(page === "home") {
            const featured = products.slice(0,4);
            const grid = document.getElementById('featuredGrid');
            if(grid) grid.innerHTML = featured.map(p => `<div class="product-card" data-id="${p.id}"><div class="product-img"><i class="${p.imageIcon}"></i></div><div class="product-info"><div class="product-title">${escapeHtml(p.name)}</div><div class="price">${formatPrice(p.price)} ៛</div><button class="add-to-cart" data-id="${p.id}"><i class="fas fa-cart-plus"></i> បន្ថែម</button></div></div>`).join('');
            document.getElementById('exploreBtn')?.addEventListener('click',()=>{ document.querySelector('[data-page="products"]').click(); });
            attachAddToCartEvents();
        } else if(page === "products") {
            attachAddToCartEvents();
            const searchVal = document.getElementById('searchInput').value;
            if(searchVal !== currentSearchTerm && searchVal && searchVal !== search) { 
                currentSearchTerm = searchVal; 
                loadPage('products', currentSearchTerm); 
            }
        } else if(page === "contact") {
            document.getElementById('sendContactBtn')?.addEventListener('click',()=>{ showToast("អរគុណ! សាររបស់អ្នកត្រូវបានផ្ញើរួចរាល់។"); });
        }
        
        document.querySelectorAll('.nav-link').forEach(link => { link.classList.remove('active'); if(link.dataset.page === page) link.classList.add('active'); });
        if(page === "products" && search) document.getElementById('searchInput').value = search;
        else if(page !== "products") document.getElementById('searchInput').value = "";
        currentSearchTerm = (page === "products" && search) ? search : "";
    }

    function attachAddToCartEvents() {
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.removeEventListener('click', window._cartHandler);
            const handler = (e) => { e.stopPropagation(); addToCart(parseInt(btn.dataset.id)); };
            btn.addEventListener('click', handler);
            btn._cartHandler = handler;
        });
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => { if(!e.target.closest('.add-to-cart')) showToast("ចុចមើលព័ត៌មានលម្អិត"); });
        });
    }

    // navigation & search logic
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => { e.preventDefault(); const page = link.dataset.page; currentSearchTerm = ""; document.getElementById('searchInput').value = ""; loadPage(page); });
    });
    document.getElementById('logoHome')?.addEventListener('click', () => { loadPage('home'); document.getElementById('searchInput').value = ""; currentSearchTerm = ""; });
    document.getElementById('searchBtn')?.addEventListener('click', () => {
        const term = document.getElementById('searchInput').value.trim().toLowerCase();
        if(term) { currentSearchTerm = term; loadPage('products', term); }
        else if(currentPage === "products") loadPage('products', "");
        else loadPage('products', "");
    });
    document.getElementById('searchInput')?.addEventListener('keyup', (e) => { if(e.key === 'Enter') document.getElementById('searchBtn').click(); });
    document.getElementById('cartIcon')?.addEventListener('click', openCart);
    document.getElementById('closeCart')?.addEventListener('click', closeCart);
    document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
    document.getElementById('checkoutBtn')?.addEventListener('click', checkout);
    
    loadCart();
    loadPage('home');
