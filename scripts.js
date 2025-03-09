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
    
    // Check for saved theme preference
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
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
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
    
    // Add to Cart
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
    
    // Empty cart button click event
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
            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: 1
            });
        }
        
        // Save cart to localStorage
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
            
            // Clear cart items container
            while (cartItemsContainer.firstChild && !cartItemsContainer.firstChild.classList?.contains('empty-cart')) {
                cartItemsContainer.removeChild(cartItemsContainer.firstChild);
            }
            
            // Add cart items
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-img">
                        <img src="/api/placeholder/60/60" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <div class="cart-item-controls">
                        <div class="cart-quantity">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <div class="quantity-value">${item.quantity}</div>
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                cartItemsContainer.insertBefore(cartItem, emptyCartElement);
            });
            
            // Add event listeners to new buttons
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    removeFromCart(id);
                });
            });
            
            document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const item = cart.find(item => item.id === id);
                    if (item && item.quantity > 1) {
                        updateQuantity(id, item.quantity - 1);
                    }
                });
            });
            
            document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const item = cart.find(item => item.id === id);
                    if (item) {
                        updateQuantity(id, item.quantity + 1);
                    }
                });
            });
        }
        
        // Update cart summary
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const deliveryFee = subtotal > 0 ? 2.99 : 0;
        const total = subtotal + deliveryFee;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    // Testimonial Slider
    function showSlide(index) {
        if (index < 0) {
            currentSlide = totalSlides - 1;
        } else if (index >= totalSlides) {
            currentSlide = 0;
        } else {
            currentSlide = index;
        }
        
        const slides = document.querySelectorAll('.testimonial-slide');
        slides.forEach(slide => slide.classList.remove('active'));
        slides[currentSlide].classList.add('active');
        
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentSlide].classList.add('active');
    }
    
    prevBtn.addEventListener('click', function() {
        showSlide(currentSlide - 1);
    });
    
    nextBtn.addEventListener('click', function() {
        showSlide(currentSlide + 1);
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
        });
    });
    
    // Auto slide testimonials
    setInterval(function() {
        showSlide(currentSlide + 1);
    }, 5000);
    
    // Checkout button
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
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                closeCart();
            }
        });
    });
    
    // Load cart from localStorage on page load
    loadCart();
});