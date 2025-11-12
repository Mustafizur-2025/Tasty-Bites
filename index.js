// Food menu data
const foodItems = [
    {
        id: 1,
        name: "Margherita Pizza",
        description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil",
        price: 12.99,
        image: "🍕",
        category: "pizza"
    },
    {
        id: 2,
        name: "Chicken Burger",
        description: "Juicy chicken patty with lettuce, tomato, and special sauce",
        price: 8.99,
        image: "🍔",
        category: "burger"
    },
    {
        id: 3,
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with parmesan cheese and caesar dressing",
        price: 9.99,
        image: "🥗",
        category: "salad"
    },
    {
        id: 4,
        name: "Pasta Carbonara",
        description: "Creamy pasta with bacon, eggs, and parmesan cheese",
        price: 13.99,
        image: "🍝",
        category: "pasta"
    },
    {
        id: 5,
        name: "Grilled Salmon",
        description: "Fresh salmon fillet with lemon butter sauce and vegetables",
        price: 16.99,
        image: "🐟",
        category: "seafood"
    },
    {
        id: 6,
        name: "Chocolate Cake",
        description: "Rich chocolate cake with creamy frosting and chocolate shavings",
        price: 6.99,
        image: "🍰",
        category: "dessert"
    }
];

// Shopping cart array
let cart = [];

// Users database (stored in memory - in production, use a backend)
let users = [];

// Current logged in user
let currentUser = null;

// DOM elements
const foodGrid = document.getElementById('food-grid');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const orderModal = document.getElementById('order-modal');

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
    loadUsersFromStorage();
    loadCurrentUser();

    if (foodGrid) {
        displayFoodItems();
        updateCartCount();
        setupEventListeners();
        updateNavigation();
    }
});

// ============= Authentication Functions =============

// Switch between login and signup forms
function switchToSignup() {
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('signup-form').classList.add('active');
}

function switchToLogin() {
    document.getElementById('signup-form').classList.remove('active');
    document.getElementById('login-form').classList.add('active');
}

// Handle Signup
function handleSignup() {
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    // Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    // Check if email already exists
    if (users.find(user => user.email === email)) {
        showNotification('Email already registered', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        password: password
    };

    users.push(newUser);
    saveUsersToStorage();

    showNotification('Account created successfully!', 'success');

    // Clear form
    document.getElementById('signup-name').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-phone').value = '';
    document.getElementById('signup-password').value = '';
    document.getElementById('signup-confirm-password').value = '';

    // Switch to login
    setTimeout(() => {
        switchToLogin();
    }, 1500);
}

// Handle Login
function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    // Validation
    if (!email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showNotification('Invalid email or password', 'error');
        return;
    }

    // Login successful
    currentUser = user;
    saveCurrentUser();

    showNotification(`Welcome back, ${user.name}!`, 'success');

    // Redirect to home page
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Handle Logout
function handleLogout() {
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    showNotification('Logged out successfully', 'success');

    setTimeout(() => {
        window.location.href = 'auth.html';
    }, 1000);
}

// Update navigation to show user profile or login button
function updateNavigation() {
    const navContainer = document.querySelector('.nav-container');
    const existingProfile = document.querySelector('.user-profile');
    const existingLoginBtn = document.querySelector('.login-btn');

    if (existingProfile) existingProfile.remove();
    if (existingLoginBtn) existingLoginBtn.remove();

    if (currentUser) {
        // Show user profile
        const userProfile = document.createElement('div');
        userProfile.className = 'user-profile';
        userProfile.innerHTML = `
            <div class="user-avatar">${currentUser.name.charAt(0).toUpperCase()}</div>
            <span>${currentUser.name}</span>
            <button class="logout-btn" onclick="handleLogout()">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        `;
        navContainer.appendChild(userProfile);
    } else {
        // Show login button
        const loginBtn = document.createElement('a');
        loginBtn.href = 'auth.html';
        loginBtn.className = 'login-btn';
        loginBtn.style.cssText = `
            background: white;
            color: #ff6b6b;
            padding: 8px 20px;
            border-radius: 20px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s;
        `;
        loginBtn.innerHTML = '<i class="fas fa-user"></i> Login';
        navContainer.appendChild(loginBtn);
    }
}

// Save users to localStorage
function saveUsersToStorage() {
    localStorage.setItem('deliciousBitesUsers', JSON.stringify(users));
}

// Load users from localStorage
function loadUsersFromStorage() {
    const storedUsers = localStorage.getItem('deliciousBitesUsers');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }
}

// Save current user to sessionStorage
function saveCurrentUser() {
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
}

// Load current user from sessionStorage
function loadCurrentUser() {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }
}

// ============= Original Food Ordering Functions =============

// Display food items
function displayFoodItems() {
    foodGrid.innerHTML = '';

    foodItems.forEach(item => {
        const foodCard = document.createElement('div');
        foodCard.className = 'food-card';
        foodCard.innerHTML = `
            <div class="food-image">${item.image}</div>
            <div class="food-info">
                <h3 class="food-name">${item.name}</h3>
                <p class="food-description">${item.description}</p>
                <p class="food-price">$${item.price.toFixed(2)}</p>
                <div class="button-group">
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                    <button class="order-now-btn" onclick="orderNow(${item.id})">
                        <i class="fas fa-bolt"></i> Order Now
                    </button>
                </div>
            </div>
        `;
        foodGrid.appendChild(foodCard);
    });
}

// Add item to cart
function addToCart(itemId) {
    if (!currentUser) {
        showNotification('Please login to add items to cart', 'error');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
        return;
    }

    const item = foodItems.find(food => food.id === itemId);
    const existingItem = cart.find(cartItem => cartItem.id === itemId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }

    updateCartCount();
    showNotification(`${item.name} added to cart!`);
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Toggle cart sidebar
function toggleCart() {
    if (!currentUser) {
        showNotification('Please login to view cart', 'error');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
        return;
    }

    cartSidebar.classList.toggle('active');
    if (cartSidebar.classList.contains('active')) {
        displayCartItems();
    }
}

// Display cart items
function displayCartItems() {
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">Your cart is empty</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-price">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
            <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: #ff6b6b; cursor: pointer;">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });

    updateCartTotal();
}

// Update cart total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Remove item from cart
function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        const item = cart[itemIndex];
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
    }

    displayCartItems();
    updateCartCount();
}

// Order now - place order for individual item
function orderNow(itemId) {
    if (!currentUser) {
        showNotification('Please login to place order', 'error');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 1500);
        return;
    }

    const item = foodItems.find(food => food.id === itemId);

    // Show confirmation modal immediately
    showNotification(`Order placed for ${item.name}!`);
    showModal();
}

// Place order
function placeOrder() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    // Simulate order placement
    setTimeout(() => {
        cart = [];
        updateCartCount();
        toggleCart();
        showModal();
    }, 1000);
}

// Show modal
function showModal() {
    orderModal.style.display = 'block';
}

// Close modal
function closeModal() {
    orderModal.style.display = 'none';
}

// Scroll to menu
function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${message}
    `;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1001;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Setup event listeners
function setupEventListeners() {
    // Close modal when clicking outside
    window.onclick = function (event) {
        if (event.target === orderModal) {
            closeModal();
        }
    };

    // Close cart when clicking outside
    document.addEventListener('click', function (event) {
        if (!cartSidebar.contains(event.target) &&
            !event.target.closest('.cart-icon')) {
            cartSidebar.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);