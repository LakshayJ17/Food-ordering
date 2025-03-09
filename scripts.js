document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let cart = [];
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.testimonial-slide').length;
    
    // DOM Elements
    const menuItems = document.querySelectorAll('.menu-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartItemsContainer = document.querySelector('.cart-items');
    const closeCartBtn = document.querySelector('.close-cart');
    const overlay = document.querySelector('.overlay');
    const subtotalElement = document.querySelector('.subtotal');
    const totalElement = document.querySelector('.total-amount');
    const cartCountElement = document.querySelector('.cart-count');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const emptyCartElement = document.querySelector('.empty-cart');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const themeToggle = document.querySelector('.theme-toggle');
    const emptyCartBtn = document.querySelector('.empty-cart-btn');
    
    // Theme Toggle Functionality
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
    
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // Mobile Menu Toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
    });
    
    // Menu Filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            menuItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Cart Functionality
    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);
    
    function openCart() {
        cartSidebar.classList.add('open');
        overlay.classList.add('active');
    }
    
    function closeCart() {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('active');
        hamburger.classList.remove('active');
        nav.classList.remove('active');
    }
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            addToCart(id, name, price);
            updateCartUI();
            openCart();
        });
    });
    
    if (emptyCartBtn) {
        emptyCartBtn.addEventListener('click', function() {
            closeCart();
        });
    }
    
    function addToCart(id, name, price) {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }
        saveCart();
    }
    
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartUI();
    }
    
    function updateQuantity(id, newQuantity) {
        if (newQuantity < 1) return;
        
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity = newQuantity;
            saveCart();
            updateCartUI();
        }
    }
    
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }
    }
    
    function updateCartUI() {
        if (cart.length === 0) {
            emptyCartElement.style.display = 'flex';
            cartCountElement.textContent = '0';
        } else {
            emptyCartElement.style.display = 'none';
            cartCountElement.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        }
        
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const deliveryFee = subtotal > 0 ? 10 : 0;
        const total = subtotal + deliveryFee;
        
        subtotalElement.textContent = `₹ ${subtotal.toFixed(2)}`;
        totalElement.textContent = `₹ ${total.toFixed(2)}`;
    }
    
    checkoutBtn.addEventListener('click', function() {
        if (cart.length > 0) {
            alert('Thank you for your order! Your delicious food will be on its way soon.');
            cart = [];
            saveCart();
            updateCartUI();
            closeCart();
        } else {
            alert('Your cart is empty. Please add some items before checkout.');
        }
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                closeCart();
            }
        });
    });
    
    loadCart();
});