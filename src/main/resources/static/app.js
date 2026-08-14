let foods = [];

let cart = [];

let selectedCategory = "All";


// ========================================
// API CONFIGURATION
// ========================================

const API_URL = "http://localhost:8081/api";


// ========================================
// LOAD FOOD
// ========================================

async function loadFoods() {

    const loading = document.getElementById("loading");

    loading.classList.remove("hidden");

    try {

        const response =
            await fetch(`${API_URL}/foods`);

        if (!response.ok) {
            throw new Error(
                `Unable to load menu: ${response.status}`
            );
        }

        foods = await response.json();

        console.log("Foods loaded:", foods);

        // Make sure price is always a number
        foods = foods.map(food => ({
            ...food,
            price: Number(food.price)
        }));

        displayFoods(foods);

    } catch (error) {

        console.error(
            "Food loading error:",
            error
        );

        showToast(
            "Unable to load menu",
            "❌"
        );

    } finally {

        loading.classList.add("hidden");
    }
}


// ========================================
// DISPLAY FOOD
// ========================================

function displayFoods(foodList) {

    const container =
        document.getElementById("foodContainer");

    const emptyState =
        document.getElementById("emptyState");

    const foodCount =
        document.getElementById("foodCount");

    container.innerHTML = "";

    foodCount.innerText =
        `${foodList.length} items`;

    if (foodList.length === 0) {

        emptyState.classList.remove("hidden");

        return;

    } else {

        emptyState.classList.add("hidden");
    }

    foodList.forEach(food => {

        container.innerHTML += `

            <div class="food-card">

                <button
                    class="favorite-btn"
                    onclick="toggleFavorite(this)">

                    ♡

                </button>

                <div class="food-image">

                    ${food.image || "🍽️"}

                </div>

                <h3>
                    ${food.name}
                </h3>

                <p class="description">
                    ${food.description || ""}
                </p>

                <div class="food-bottom">

                    <span class="price">
                        ₹${food.price}
                    </span>

                    <button
                        class="add-btn"
                        onclick="addToCart(${food.id})">

                        + Add

                    </button>

                </div>

            </div>

        `;
    });
}


// ========================================
// CATEGORY FILTER
// ========================================

function filterFood(category, button) {

    selectedCategory = category;

    document
        .querySelectorAll(".category-btn")
        .forEach(btn => {

            btn.classList.remove("active");

        });

    button.classList.add("active");

    applyFilters();
}


// ========================================
// SEARCH
// ========================================

function searchFood() {

    applyFilters();
}


// ========================================
// APPLY SEARCH + CATEGORY
// ========================================

function applyFilters() {

    const searchInput =
        document.getElementById("searchInput");

    const search =
        searchInput.value
            .toLowerCase()
            .trim();

    let result = foods;

    if (selectedCategory !== "All") {

        result = result.filter(
            food =>
                food.category === selectedCategory
        );
    }

    if (search !== "") {

        result = result.filter(food =>

            food.name
                .toLowerCase()
                .includes(search)

            ||

            (food.description || "")
                .toLowerCase()
                .includes(search)

        );
    }

    displayFoods(result);
}


// ========================================
// ADD TO CART
// ========================================

function addToCart(id) {

    const food =
        foods.find(
            item => item.id === id
        );

    if (!food) {

        showToast(
            "Food not found",
            "❌"
        );

        return;
    }

    // Convert price to number
    const price = Number(food.price);

    // Prevent invalid price
    if (!Number.isFinite(price)) {

        console.error(
            "Invalid food price:",
            food
        );

        showToast(
            "Food price is invalid",
            "❌"
        );

        return;
    }

    const existing =
        cart.find(
            item => item.id === id
        );

    if (existing) {

        existing.quantity++;

        showToast(
            `${food.name} quantity increased`,
            "➕"
        );

    } else {

        cart.push({

            id: food.id,

            name: food.name,

            price: price,

            quantity: 1

        });

        showToast(
            `${food.name} added to cart`,
            "🛒"
        );
    }

    updateCart();
}


// ========================================
// INCREASE QUANTITY
// ========================================

function increaseQuantity(id) {

    const item =
        cart.find(
            item => item.id === id
        );

    if (!item) return;

    item.quantity++;

    updateCart();
}


// ========================================
// DECREASE QUANTITY
// ========================================

function decreaseQuantity(id) {

    const item =
        cart.find(
            item => item.id === id
        );

    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== id
            );
    }

    updateCart();
}


// ========================================
// REMOVE ITEM
// ========================================

function removeItem(id) {

    const item =
        cart.find(
            item => item.id === id
        );

    cart =
        cart.filter(
            item => item.id !== id
        );

    if (item) {

        showToast(
            `${item.name} removed`,
            "🗑️"
        );
    }

    updateCart();
}


// ========================================
// CLEAR CART
// ========================================

function clearCart() {

    if (cart.length === 0) {

        showToast(
            "Cart is already empty",
            "ℹ️"
        );

        return;
    }

    cart = [];

    updateCart();

    showToast(
        "Cart cleared",
        "🗑️"
    );
}


// ========================================
// UPDATE CART
// ========================================

function updateCart() {

    const container =
        document.getElementById(
            "orderContainer"
        );

    const totalElement =
        document.getElementById(
            "totalPrice"
        );

    const subtotalElement =
        document.getElementById(
            "subtotal"
        );

    const cartCount =
        document.getElementById(
            "cartCount"
        );

    const orderItemsText =
        document.getElementById(
            "orderItemsText"
        );

    if (cart.length === 0) {

        container.innerHTML = `

            <div class="cart-empty">

                <div class="empty-cart-icon">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add something delicious
                    from the menu.
                </p>

            </div>

        `;

        totalElement.innerText = "0";

        subtotalElement.innerText = "0";

        cartCount.innerText = "0";

        orderItemsText.innerText =
            "0 items";

        return;
    }

    container.innerHTML = "";

    let total = 0;

    let itemCount = 0;

    cart.forEach(item => {

        const price =
            Number(item.price);

        const quantity =
            Number(item.quantity);

        const subtotal =
            price * quantity;

        total += subtotal;

        itemCount += quantity;

        container.innerHTML += `

            <div class="order-item">

                <div>

                    <div class="order-name">
                        ${item.name}
                    </div>

                    <div class="order-price">
                        ₹${price} each
                    </div>

                    <div class="quantity">

                        <button
                            onclick="decreaseQuantity(${item.id})">

                            −

                        </button>

                        <span>
                            ${quantity}
                        </span>

                        <button
                            onclick="increaseQuantity(${item.id})">

                            +

                        </button>

                    </div>

                </div>

                <div class="item-right">

                    <div class="item-subtotal">

                        ₹${subtotal}

                    </div>

                    <button
                        class="remove"
                        onclick="removeItem(${item.id})">

                        Remove

                    </button>

                </div>

            </div>

        `;
    });

    totalElement.innerText =
        total;

    subtotalElement.innerText =
        total;

    cartCount.innerText =
        itemCount;

    orderItemsText.innerText =
        `${itemCount} item${itemCount !== 1 ? "s" : ""}`;
}


// ========================================
// CONFIRM ORDER
// ========================================

async function confirmOrder() {

    if (cart.length === 0) {

        showToast(
            "Please add food first",
            "⚠️"
        );

        return;
    }

    // Create order data
    const orderData = {

        items: cart.map(item => ({

            foodName:
            item.name,

            price:
                Number(item.price),

            quantity:
                Number(item.quantity)

        }))

    };

    console.log(
        "Sending order:",
        orderData
    );

    try {

        const response =
            await fetch(
                `${API_URL}/orders`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            orderData
                        )

                }
            );

        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Order API error:",
                response.status,
                errorText
            );

            throw new Error(
                "Order failed"
            );
        }

        const order =
            await response.json();

        console.log(
            "Order created:",
            order
        );

        // Show generated token
        document.getElementById(
            "orderToken"
        ).innerText =
            order.orderToken;

        document.getElementById(
            "tokenModal"
        ).style.display =
            "flex";

        // Clear cart
        cart = [];

        updateCart();

        showToast(
            "Order placed successfully!",
            "✅"
        );

    } catch (error) {

        console.error(
            "Order error:",
            error
        );

        showToast(
            "Unable to place order",
            "❌"
        );
    }
}


// ========================================
// CLOSE MODAL
// ========================================

function closeModal() {

    document.getElementById(
        "tokenModal"
    ).style.display =
        "none";
}


// ========================================
// COPY TOKEN
// ========================================

function copyToken() {

    const token =
        document.getElementById(
            "orderToken"
        ).innerText;

    navigator.clipboard
        .writeText(token)
        .then(() => {

            showToast(
                "Order token copied!",
                "📋"
            );

        })
        .catch(error => {

            console.error(
                "Copy failed:",
                error
            );

            showToast(
                "Unable to copy token",
                "❌"
            );
        });
}


// ========================================
// TOAST
// ========================================

function showToast(
    message,
    icon = "✓"
) {

    const toast =
        document.getElementById(
            "toast"
        );

    const toastMessage =
        document.getElementById(
            "toastMessage"
        );

    const toastIcon =
        document.getElementById(
            "toastIcon"
        );

    toastMessage.innerText =
        message;

    toastIcon.innerText =
        icon;

    toast.classList.add(
        "show"
    );

    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 2200);
}


// ========================================
// FAVORITE
// ========================================

function toggleFavorite(button) {

    if (
        button.innerText === "♡"
    ) {

        button.innerText = "♥";

        showToast(
            "Added to favorites",
            "❤️"
        );

    } else {

        button.innerText = "♡";

        showToast(
            "Removed from favorites",
            "💔"
        );
    }
}


// ========================================
// DARK MODE
// ========================================

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );

    const isDark =
        document.body.classList.contains(
            "dark"
        );

    const themeBtn =
        document.getElementById(
            "themeBtn"
        );

    if (isDark) {

        themeBtn.innerText = "☀️";

        localStorage.setItem(
            "theme",
            "dark"
        );

    } else {

        themeBtn.innerText = "🌙";

        localStorage.setItem(
            "theme",
            "light"
        );
    }
}


// ========================================
// LOAD SAVED THEME
// ========================================

function loadTheme() {

    const savedTheme =
        localStorage.getItem(
            "theme"
        );

    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark"
        );

        document.getElementById(
            "themeBtn"
        ).innerText = "☀️";
    }
}


// ========================================
// START APP
// ========================================

loadTheme();

loadFoods();