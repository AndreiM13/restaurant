
import { menuArray } from "./data.js"

const sectionMain = document.getElementById("main")
const checkOut = document.getElementById("check-out")
const orderSummary = document.getElementById("order-summary")
const completeOrder = document.getElementById("complete-order")

const popup = document.getElementById("popup")
const closePopup = document.getElementById("close-popup")
const paymentForm = document.getElementById("payment-form")
const thankYou = document.getElementById("thank-you")

// Render menu
function renderMenu() {
    const menuHtml = menuArray.map(item => {
        return `
            <div class="menu-item" data-id="${item.id}">
                <span class="item-emoji">${item.emoji}</span>

                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-ingredients">
                        ${item.ingredients.join(", ")}
                    </p>
                    <span class="item-price">$${item.price}</span>
                </div>

                <button class="add-btn" data-id="${item.id}">
                    +
                </button>
            </div>
        `
    }).join("")

    sectionMain.innerHTML = menuHtml
}

// Add product
function addToCart(id) {
    const itemAdded = menuArray.find(item => item.id === id)

    if (itemAdded) {
        if (!itemAdded.quantity) {
            itemAdded.quantity = 1
        } else {
            itemAdded.quantity += 1
        }
    }

    thankYou.innerHTML = ""
    renderOrder()
}

// Calculate total
function getTotal() {
    let total = 0

    menuArray.forEach(item => {
        if (item.quantity && item.quantity > 0) {
            total += item.price * item.quantity
        }
    })

    return total
}

// Render order
function renderOrder() {
    const selectedItems = menuArray.filter(item => item.quantity > 0)

    if (selectedItems.length === 0) {
        checkOut.style.display = "none"
        return
    }

    checkOut.style.display = "block"

    const orderHtml = selectedItems.map(item => {
        return `
            <div class="order-item">
                <span class="order-name">
                    ${item.name} x ${item.quantity}
                </span>

                <span class="order-price">
                    $${item.price * item.quantity}
                </span>

                <button class="remove-btn" data-id="${item.id}">
                    remove
                </button>
            </div>
        `
    }).join("")

    const totalQuantity = selectedItems.reduce((total, item) => {
        return total + item.quantity
    }, 0)

    orderSummary.innerHTML = `
        <h2 class="order-title">Your Order</h2>

        ${orderHtml}

        <div class="order-total">
            <span>Total price (${totalQuantity} items):</span>
            <span>$${getTotal()}</span>
        </div>
    `
}

// Remove product
function removeFromCart(id) {
    const item = menuArray.find(item => item.id === id)

    if (item && item.quantity > 0) {
        item.quantity--
    }

    renderOrder()
}

// Handle clicks
document.addEventListener("click", function(event) {

    if (event.target.classList.contains("add-btn")) {
        const itemId = Number(event.target.dataset.id)
        addToCart(itemId)
    }

    if (event.target.classList.contains("remove-btn")) {
        const itemId = Number(event.target.dataset.id)
        removeFromCart(itemId)
    }
})

// Open payment popup
completeOrder.addEventListener("click", function() {
    popup.classList.remove("hidden")
    document.getElementById("customer-name").focus()
})

// Close popup
closePopup.addEventListener("click", function() {
    popup.classList.add("hidden")
})

// Close popup when clicking outside
popup.addEventListener("click", function(event) {
    if (event.target === popup) {
        popup.classList.add("hidden")
    }
})

// Handle payment form
paymentForm.addEventListener("submit", function(event) {
    event.preventDefault()

    const customerName = document.getElementById("customer-name").value.trim()

    if (!customerName) {
        return
    }

    // Hide payment popup
    popup.classList.add("hidden")

    // Clear order
    menuArray.forEach(item => {
        item.quantity = 0
    })

    // Hide checkout
    renderOrder()

    // Show thank-you message safely
    thankYou.innerHTML = ""

    const message = document.createElement("p")
    message.className = "thank-you-message"
    message.textContent =
        `Thank you, ${customerName}! Your order is on its way!`

    thankYou.appendChild(message)

    // Reset form
    paymentForm.reset()
})

// Initial rendering
renderMenu()
renderOrder()
