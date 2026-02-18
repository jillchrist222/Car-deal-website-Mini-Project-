// Load product from localStorage
const product = JSON.parse(localStorage.getItem("orderProduct"));

if (product) {

    document.getElementById("summaryImage").src = product.image;
    document.getElementById("summaryName").innerText = product.name;
    document.getElementById("summaryPrice").innerText = product.price;
    document.getElementById("summaryTotal").innerText = product.price;
}

function goToPayment() {
    window.location.href = "payment.html";
}

