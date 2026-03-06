// --- Data Models ---

// Pre-defined catalog (Store)
const storeCatalog = [
    { id: 101, name: 'Fresh Milk 1L', defaultPrice: 3.50, category: 'Dairy', image: 'assets/grocery_milk_1772767381790.png' },
    { id: 102, name: 'Sliced Bread', defaultPrice: 2.80, category: 'Bakery', image: 'assets/grocery_bread_1772767396840.png' },
    { id: 103, name: 'Free Range Eggs (12)', defaultPrice: 5.20, category: 'Dairy', image: 'assets/grocery_eggs_1772767469605.png' },
    { id: 104, name: 'Red Apples (Bag)', defaultPrice: 4.50, category: 'Produce', image: 'assets/grocery_apples_1772767625573.png' },
    { id: 105, name: 'Chicken Breast (1kg)', defaultPrice: 8.50, category: 'Meat', image: 'assets/grocery_chicken_1772767674048.png' },
    { id: 106, name: 'Orange Juice 2L', defaultPrice: 4.20, category: 'Pantry', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=80' },
    { id: 107, name: 'Avocado', defaultPrice: 1.50, category: 'Produce', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80' },
    { id: 108, name: 'Cereal Box', defaultPrice: 3.90, category: 'Pantry', image: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=400&q=80' }
];

// User's Shopping List (State)
let products = [
    { id: 1, name: 'Fresh Milk 1L', quantity: 2, price: 3.50, category: 'Dairy', image: 'assets/grocery_milk_1772767381790.png', purchased: false },
    { id: 2, name: 'Sliced Bread', quantity: 1, price: 2.80, category: 'Bakery', image: 'assets/grocery_bread_1772767396840.png', purchased: false },
    { id: 3, name: 'Free Range Eggs (12)', quantity: 1, price: 5.20, category: 'Dairy', image: 'assets/grocery_eggs_1772767469605.png', purchased: true }
];

let currentFilter = 'all';

// --- DOM Elements ---
// Navigation
const navItems = document.querySelectorAll('.nav-item[data-view]');
const viewContainers = document.querySelectorAll('.view-container');
const pageTitle = document.getElementById('pageTitle');

// Grids
const dashboardProductGrid = document.getElementById('dashboardProductGrid');
const listProductGrid = document.getElementById('listProductGrid');
const storeProductGrid = document.getElementById('storeProductGrid');

// Modal Elements
const addModal = document.getElementById('addModal');
const openModalBtn = document.getElementById('openAddModalBtn');
const closeBtns = document.querySelectorAll('.close-modal-btn');
const addForm = document.getElementById('addProductForm');
const filterBtns = document.querySelectorAll('.filter-btn');

// Stats Elements
const statTotalDash = document.getElementById('statTotalDash');
const statPurchasedDash = document.getElementById('statPurchasedDash');
const statPendingDash = document.getElementById('statPendingDash');
const statCost = document.getElementById('statCost');
const mockChart = document.getElementById('mockChart');


// --- Initialization ---
function init() {
    feather.replace();
    setupEventListeners();

    // Initial render
    updateStats();
    renderChart();

    // Read hash for routing, default to dashboard
    const initialView = window.location.hash.replace('#', '') || 'dashboard';
    switchView(initialView);
}


// --- Routing & View Logic ---
window.switchView = function (viewId) {
    if (!viewId) return;

    // Update active nav link
    navItems.forEach(item => {
        if (item.dataset.view === viewId) {
            item.classList.add('active');
            pageTitle.textContent = item.querySelector('span').textContent;
        } else {
            item.classList.remove('active');
        }
    });

    // Update active view container
    viewContainers.forEach(container => {
        if (container.id === `view-${viewId}`) {
            container.classList.add('active');
        } else {
            container.classList.remove('active');
        }
    });

    // Render specific view content
    if (viewId === 'dashboard') {
        renderDashboard();
        updateStats();
    } else if (viewId === 'list') {
        renderList();
    } else if (viewId === 'store') {
        renderStore();
    } else if (viewId === 'statistics') {
        renderChart();
        updateStats();
    }
};


// --- Event Listeners ---
function setupEventListeners() {
    // Navigation routing
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = item.dataset.view;
            window.location.hash = viewId;
            switchView(viewId);
        });
    });

    // Hash change routing (back/forward browser buttons)
    window.addEventListener('hashchange', () => {
        const viewId = window.location.hash.replace('#', '') || 'dashboard';
        switchView(viewId);
    });

    // Modal
    openModalBtn.addEventListener('click', () => {
        addModal.classList.add('active');
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            addModal.classList.remove('active');
            addForm.reset();
        });
    });

    addModal.addEventListener('click', (e) => {
        if (e.target === addModal) {
            addModal.classList.remove('active');
            addForm.reset();
        }
    });

    // Form Submit (Custom Product)
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newProduct = {
            id: Date.now(),
            name: document.getElementById('productName').value,
            quantity: Number(document.getElementById('productQuantity').value),
            price: Number(document.getElementById('productPrice').value),
            category: document.getElementById('productCategory').value,
            image: document.getElementById('productImage').value || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
            purchased: false
        };

        products.unshift(newProduct);
        addModal.classList.remove('active');
        addForm.reset();

        // Return to list view
        window.location.hash = 'list';
        switchView('list');
    });

    // Filtering in List View
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderList();
        });
    });

    // Global Search (filters whichever list is active)
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        // Determine which view is active and re-render it with search
        const activeContainer = document.querySelector('.view-container.active');
        if (activeContainer.id === 'view-dashboard') renderDashboard(searchTerm);
        if (activeContainer.id === 'view-list') renderList(searchTerm);
        if (activeContainer.id === 'view-store') renderStore(searchTerm);
    });
}


// --- Rendering Functions ---

// Renders a single shopping list product card (HTML string)
function createProductCardHTML(product) {
    const totalCost = (product.price * product.quantity).toFixed(2);
    return `
        <div class="product-card ${product.purchased ? 'purchased' : ''}">
            <div class="card-top">
                <div class="card-img-container">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'">
                </div>
                <div class="card-actions">
                    <button class="card-btn btn-check" onclick="togglePurchased(${product.id})" title="${product.purchased ? 'Mark as Pending' : 'Mark as Purchased'}">
                        <i data-feather="${product.purchased ? 'rotate-ccw' : 'check'}"></i>
                    </button>
                    <button class="card-btn btn-delete" onclick="deleteProduct(${product.id})" title="Delete Item">
                        <i data-feather="trash-2"></i>
                    </button>
                </div>
            </div>
            <div class="product-category">${product.category}</div>
            <h3 class="product-title">${product.name}</h3>
            <div class="card-bottom">
                <div class="product-qty">Qty: ${product.quantity}</div>
                <div class="product-price">$${totalCost}</div>
            </div>
        </div>
    `;
}

// Render Dashboard View (shows only up to 4 recent items)
function renderDashboard(searchTerm = '') {
    dashboardProductGrid.innerHTML = '';
    let displayList = products;

    if (searchTerm) {
        displayList = products.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    // Take only the first 4 for the dashboard
    const recentItems = displayList.slice(0, 4);

    if (recentItems.length === 0) {
        dashboardProductGrid.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-muted);">No recent items.</p>`;
    } else {
        recentItems.forEach(product => {
            dashboardProductGrid.innerHTML += createProductCardHTML(product);
        });
    }
    feather.replace();
}

// Render the Full Shopping List view
function renderList(searchTerm = '') {
    listProductGrid.innerHTML = '';

    let filteredProducts = products;

    if (currentFilter === 'pending') {
        filteredProducts = products.filter(p => !p.purchased);
    } else if (currentFilter === 'purchased') {
        filteredProducts = products.filter(p => p.purchased);
    }

    if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    if (filteredProducts.length === 0) {
        listProductGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
                <i data-feather="inbox" style="width: 48px; height: 48px; margin-bottom: 16px;"></i>
                <p>No products found in list.</p>
            </div>
        `;
    } else {
        filteredProducts.forEach(product => {
            listProductGrid.innerHTML += createProductCardHTML(product);
        });
    }
    feather.replace();
    updateStats();
}

// Render the Discover Store view
function renderStore(searchTerm = '') {
    storeProductGrid.innerHTML = '';

    let catalog = storeCatalog;
    if (searchTerm) {
        catalog = catalog.filter(p => p.name.toLowerCase().includes(searchTerm));
    }

    if (catalog.length === 0) {
        storeProductGrid.innerHTML = `<p style="grid-column: 1/-1; color: var(--text-muted);">No items found in catalog.</p>`;
    } else {
        catalog.forEach(item => {
            // Check if item is already in list to change button text/state
            const inList = products.some(p => p.name === item.name);
            const btnClass = inList ? 'btn-secondary' : 'btn-primary';
            const btnText = inList ? 'Add Another' : 'Add to List';
            const btnIcon = inList ? 'plus-circle' : 'shopping-cart';

            storeProductGrid.innerHTML += `
                <div class="product-card">
                    <div class="card-top" style="margin-bottom: 8px;">
                        <div class="card-img-container" style="width: 100%; height: 140px; border-radius: 8px; margin-bottom: 12px;">
                            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'">
                        </div>
                    </div>
                    <div class="product-category">${item.category}</div>
                    <h3 class="product-title" style="margin-bottom: 8px;">${item.name}</h3>
                    <div class="product-price" style="margin-bottom: 16px;">$${item.defaultPrice.toFixed(2)}</div>
                    
                    <button class="btn ${btnClass}" style="width: 100%; justify-content: center;" onclick="addToShoppingListFromStore(${item.id})">
                        <i data-feather="${btnIcon}"></i> ${btnText}
                    </button>
                </div>
            `;
        });
    }
    feather.replace();
}


// --- Global State Mutation Actions --- 

window.togglePurchased = function (id) {
    const product = products.find(p => p.id === id);
    if (product) {
        product.purchased = !product.purchased;
        // Re-render the currently active view
        const activeContainer = document.querySelector('.view-container.active');
        if (activeContainer.id === 'view-dashboard') renderDashboard();
        if (activeContainer.id === 'view-list') renderList();
        updateStats();
    }
};

window.deleteProduct = function (id) {
    if (confirm('Are you sure you want to remove this item?')) {
        products = products.filter(p => p.id !== id);
        const activeContainer = document.querySelector('.view-container.active');
        if (activeContainer.id === 'view-dashboard') renderDashboard();
        if (activeContainer.id === 'view-list') renderList();
        if (activeContainer.id === 'view-store') renderStore(); // To update 'Add another' button states
        updateStats();
    }
};

window.addToShoppingListFromStore = function (storeId) {
    const catalogItem = storeCatalog.find(i => i.id === storeId);
    if (!catalogItem) return;

    // Check if it already exists, if so just increment quantity
    const existingObj = products.find(p => p.name === catalogItem.name);
    if (existingObj) {
        existingObj.quantity += 1;
        // Reset purchase status when buying more
        existingObj.purchased = false;
    } else {
        // Add new reference
        products.unshift({
            id: Date.now(),
            name: catalogItem.name,
            quantity: 1,
            price: catalogItem.defaultPrice,
            category: catalogItem.category,
            image: catalogItem.image,
            purchased: false
        });
    }

    // Give visual feedback then stay on store
    updateStats();
    renderStore(); // re-evaluates button states
};


// --- Dashboard Stats & Charts ---
function updateStats() {
    statTotalDash.textContent = products.length;

    const purchasedList = products.filter(p => p.purchased);
    statPurchasedDash.textContent = purchasedList.length;

    const pendingList = products.filter(p => !p.purchased);
    statPendingDash.textContent = pendingList.length;

    const totalCostAmt = products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    statCost.textContent = '$' + totalCostAmt.toFixed(2);
}

function renderChart() {
    mockChart.innerHTML = '';

    // Calculate total spend from our current list for the "current" month indicator
    const currentMonthSpend = products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

    const monthData = [
        { label: 'Feb', value: 65 },
        { label: 'Mar', value: 35 },
        { label: 'Apr', value: 80 },
        { label: 'May', value: 55 },
        { label: 'Jun', value: 90 },
        { label: 'Jul', value: currentMonthSpend > 0 ? currentMonthSpend : 15 }, // dynamic last bar
    ];

    const maxValue = Math.max(...monthData.map(d => d.value));

    monthData.forEach(data => {
        const heightPercent = maxValue === 0 ? 0 : (data.value / maxValue) * 100;

        const barContainer = document.createElement('div');
        barContainer.className = 'chart-bar-container';

        barContainer.innerHTML = `
            <div class="chart-bar" style="height: ${heightPercent}%" title="$${data.value.toFixed(2)}"></div>
            <div class="chart-label">${data.label}</div>
        `;

        mockChart.appendChild(barContainer);
    });
}

// Boot up
document.addEventListener('DOMContentLoaded', init);
