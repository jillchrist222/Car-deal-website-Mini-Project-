let cart = JSON.parse(localStorage.getItem("cart")) || [];

let summaryContainer = document.getElementById("summaryItems");
let total = 0;

summaryContainer.innerHTML = "";

if (cart.length === 0) {
    summaryContainer.innerHTML = "<p>Your cart is empty</p>";
} else {

  cart.forEach((item) => {

    let quantity = item.quantity || item.qty || 1;
    let price = Number(item.price);
    let itemTotal = price * quantity;
    total += itemTotal;

    summaryContainer.innerHTML += `
        <div style="display:flex; gap:15px; margin-bottom:20px; align-items:center;">

            <img src="${item.image}" width="80" height="80" style="border-radius:8px; object-fit:cover;">

            <div>
                <h4>${item.name}</h4>
                <p>Price: ₹${price}</p>
                <p>Quantity: ${quantity}</p>
                <p><strong>Subtotal: ₹${itemTotal}</strong></p>
            </div>

        </div>
    `;
});
}

document.getElementById("summaryTotal").textContent = total;

function goToPayment2() {
    window.location.href = "payment2.html";
}
