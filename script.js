function goShowRoom() {
    window.open("https://www.zigwheels.com/dealers/Coimbatore", "_blank");
}

// GET BODY
const body = document.body;

// APPLY SAVED THEME ON EVERY PAGE LOAD
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    body.classList.add("dark");
}

// THEME TOGGLE BUTTON
const toggleBtn = document.getElementById("themeToggle");

if (toggleBtn) {
    // Set correct icon on load
    toggleBtn.textContent = body.classList.contains("dark") ? "☀️" : "🌙";

    toggleBtn.addEventListener("click", () => {
        body.classList.toggle("dark");

        if (body.classList.contains("dark")) {
            localStorage.setItem("theme", "dark");
            toggleBtn.textContent = "☀️";
        } else {
            localStorage.setItem("theme", "light");
            toggleBtn.textContent = "🌙";
        }
    });
}


const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

let index = 0;

/* SAFETY CHECK */
if (slides.length > 0) {
  slides[0].classList.add("active");
  dots[0].classList.add("active");
}

function showSlide(i) {
  slides.forEach(slide => slide.classList.remove("active"));
  dots.forEach(dot => dot.classList.remove("active"));

  slides[i].classList.add("active");
  dots[i].classList.add("active");
}

/* AUTO MOVE */
setInterval(() => {
  index = (index + 1) % slides.length;
  showSlide(index);
}, 4000);

/* DOT CLICK */
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    index = i;
    showSlide(index);
  });
});

function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.name === name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      name,
      price,
      image,
      qty: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").textContent = count;
}

// Load count on page load
updateCartCount();


function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartItems = document.getElementById("cartItems");
  let total = 0;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p class='empty-cart'>Your cart is empty</p>";
    document.getElementById("totalPrice").textContent = 0;
    return;
  }

  cart.forEach((item, index) => {
    let itemTotal = item.price * item.qty;
    total += itemTotal;

    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}">

        <div class="cart-info">
          <h4>${item.name}</h4>
          <p>₹ ${item.price} × ${item.qty}</p>
          <strong>₹ ${itemTotal}</strong>
        </div>

        <div class="qty-controls">
          <button onclick="changeQty(${index}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${index}, 1)">+</button>
        </div>

        <button class="delete-btn" onclick="removeItem(${index})">✖</button>
      </div>
    `;
  });

  document.getElementById("totalPrice").textContent = total;
}

  document.getElementById("totalPrice").textContent = total


  function changeQty(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart[index].qty += change;

  // If quantity becomes 0, remove item
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartCount", cart.length);

  const countEl = document.getElementById("cartCount");
  if (countEl) countEl.textContent = cart.length;

  loadCart(); // refresh cart UI only
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Remove clicked item
  cart.splice(index, 1);

  // Save updated cart
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartCount", cart.length);

  // Update navbar cart count (if exists)
  const countEl = document.getElementById("cartCount");
  if (countEl) countEl.textContent = cart.length;

  // Reload ONLY cart items (not page)
  loadCart();
}

function filterCars() {

  const brand = document.getElementById("brandFilter").value;
  const price = document.getElementById("priceFilter").value;
  const location = document.getElementById("locationFilter").value;
  const fuel = document.getElementById("fuelFilter").value;

  const cars = document.querySelectorAll(".car-card");

  cars.forEach(car => {

    const carBrand = car.dataset.brand;
    const carPrice = parseInt(car.dataset.price);
    const carLocation = car.dataset.location;
    const carFuel = car.dataset.fuel;

    let show = true;

    if (brand && carBrand !== brand) show = false;
    if (location && carLocation !== location) show = false;
    if (fuel && carFuel !== fuel) show = false;

    if (price) {
      const [min, max] = price.split("-").map(Number);
      if (carPrice < min || carPrice > max) show = false;
    }

    car.style.display = show ? "" : "none";

  });

  // ✅ PUT IT HERE (after forEach)
  const visibleCars = [...cars].filter(car => car.style.display !== "none");

  document.getElementById("noCarsMsg").style.display =
    visibleCars.length === 0 ? "block" : "none";
}


function openModal() {
    const modal = document.getElementById("bookingModal");
    modal.style.display = "flex";

    document.body.style.overflow = "hidden";   // STOP SCROLL
}

function closeModal() {
    const modal = document.getElementById("bookingModal");
    modal.style.display = "none";

    document.body.style.overflow = "auto";     // ENABLE SCROLL
}


function sendToWhatsApp() {

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const pickup = document.getElementById("pickup").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!name || !email || !phone || !pickup || !destination || !date || !time) {
        alert("Please fill all details!");
        return;
    }

    const carName = localStorage.getItem("selectedCarName") || "Not Selected";
    const carPrice = localStorage.getItem("selectedCarPrice") || "Not Available";

    const message =
`🚗 *New Car Booking*

Car: ${carName}
Price: ${carPrice}

Name: ${name}
Email: ${email}
Phone: ${phone}
Pickup: ${pickup}
Destination: ${destination}
Date: ${date}
Time: ${time}`;

    const whatsappNumber = "918148772264"; // Without + symbol

    const url = "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message);

    window.open(url, "_blank");

    document.getElementById("successPopup").style.display = "flex";

    closeModal();
}

function openBooking(carName, carPrice) {

    localStorage.setItem("selectedCarName", carName);
    localStorage.setItem("selectedCarPrice", carPrice);

    openModal(); // your existing popup function
}

function closeSuccess() {
    document.getElementById("successPopup").style.display = "none";
}

function openService() {

    const form = document.getElementById("serviceForm");

    form.style.display = "block";

    form.scrollIntoView({ behavior: "smooth" });
}


function serviceSendToWhatsapp() {

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const date = document.getElementById("date").value.trim();
    const vehicle = document.getElementById("vehicle").value.trim();
    const year = document.getElementById("year").value.trim();
    const service = document.getElementById("service").value.trim();
    const problem = document.getElementById("problem").value.trim();

    console.log(name, phone, date, vehicle, year, service, problem);

    if (!name || !phone || !date || !vehicle || !year || !service || !problem) {
        alert("Please fill all details!");
        return;
    }

    const message =
        "🚗 *New Service Booking*%0A%0A" +
        "Name: " + name + "%0A" +
        "Phone: " + phone + "%0A" +
        "Date: " + date + "%0A" +
        "Vehicle: " + vehicle + "%0A" +
        "Year: " + year + "%0A" +
        "Service: " + service + "%0A" +
        "Problem: " + problem;

    const whatsappNumber = "918148772264";
    const url = "https://wa.me/" + whatsappNumber + "?text=" + message;

    window.open(url, "_blank");

   document.getElementById("bookingPopup").style.display = "flex";
}

function closeBookingPopup() {
  document.getElementById("bookingPopup").style.display = "none";
}


// Buy Now
function buyNow(name, price, image) {

    // Clear old product
    localStorage.removeItem("orderProduct");

    // Save selected product
    const product = {
        name: name,
        price: price,
        image: image
    };

    localStorage.setItem("orderProduct", JSON.stringify(product));

    window.location.href = "address.html";
}
// Go to Summary
function goToSummary(event) {

    event.preventDefault();   // 🚨 THIS IS MISSING IN YOUR CODE

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const altPhone = document.getElementById("altPhone").value.trim();
    const address = document.getElementById("address").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();

    if (!firstName || !lastName || !phone || !address || !pincode || !city || !state) {
        alert("Please fill all required fields ❌");
        return;
    }

    // Save data
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("phone", phone);
    localStorage.setItem("altPhone", altPhone);
    localStorage.setItem("address", address);
    localStorage.setItem("pincode", pincode);
    localStorage.setItem("city", city);
    localStorage.setItem("state", state);

    // Go to summary
    window.location.href = "summary.html";
}

// Show Summary
if(window.location.pathname.includes("summary.html")){
    document.getElementById("product").innerText =
        "Product: "+localStorage.getItem("productName");

    document.getElementById("price").innerText =
        "Price: ₹"+localStorage.getItem("productPrice");
}

// Go to Payment
function goToPayment(){
    window.location.href="payment.html";
}

// Place Order
function placeOrder() {

    const name = localStorage.getItem("productName");
    const price = localStorage.getItem("productPrice");

    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const phone = localStorage.getItem("phone");
    const address = localStorage.getItem("address");
    const city = localStorage.getItem("city");
    const state = localStorage.getItem("state");
    const pincode = localStorage.getItem("pincode");

    const whatsappNumber = "918148772264"; // your number

    const message =
        "🛒 *New Order Received* %0A%0A" +
        "Product: " + name + "%0A" +
        "Price: ₹" + price + "%0A%0A" +
        "Customer: " + firstName + " " + lastName + "%0A" +
        "Phone: " + phone + "%0A" +
        "Address: " + address + ", " + city + ", " + state + " - " + pincode;

    // ✅ FIRST create URL
    const url = "https://wa.me/" + whatsappNumber + "?text=" + message;

    // ✅ THEN open WhatsApp
   const whatsappWindow = window.open(url, "_blank");

setTimeout(() => {

    const popup = document.getElementById("orderStatusPopup");
    const title = document.getElementById("statusTitle");
    const messageBox = document.getElementById("statusMessage");

    // If WhatsApp window was opened
    if (whatsappWindow) {

        title.style.color = "green";
        title.innerText = "Order Placed Successfully! ✅";
        messageBox.innerText = "Your order has been sent via WhatsApp.";

    } else {

        title.style.color = "red";
        title.innerText = "Order Declined ❌";
        messageBox.innerText = "WhatsApp did not open. Order cancelled.";

    }

    popup.style.display = "flex";

}, 2000);
    }
    function closeStatus(){
    document.getElementById("orderStatusPopup").style.display = "none";
}


function goToCartAddress() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    localStorage.setItem("orderType", "cart");

    window.location.href = "address2.html";
}

function saveAddressAndGoToSummary() {

    const name = document.getElementById("fullName").value;

    if (!name) {
        alert("Fill address properly");
        return;
    }

    window.location.href = "summary2.html";
}

function proceedToSummaryPage(event) {
   event.preventDefault(); 
   const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const altPhone = document.getElementById("altPhone").value.trim();
    const address = document.getElementById("address").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();

    if (!firstName || !lastName || !phone || !address || !pincode || !city || !state) {
        alert("Please fill all required fields ❌");
        return;
    }

    // Save data
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);
    localStorage.setItem("phone", phone);
    localStorage.setItem("altPhone", altPhone);
    localStorage.setItem("address", address);
    localStorage.setItem("pincode", pincode);
    localStorage.setItem("city", city);
    localStorage.setItem("state", state);

    // Go to summary
    window.location.href = "summary2.html";
}
    



function confirmFinalOrder() {

    // 🛒 Get Cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    // 📦 Get Address Fields
    const firstName = localStorage.getItem("firstName") || "";
    const lastName  = localStorage.getItem("lastName") || "";
    const phone     = localStorage.getItem("phone") || "";
    const address   = localStorage.getItem("address") || "";
    const city      = localStorage.getItem("city") || "";
    const state     = localStorage.getItem("state") || "";
    const pincode   = localStorage.getItem("pincode") || "";

    let total = 0;

    let message = "🛒 *New Order Received* %0A%0A";

    // 🔁 Loop Cart Products
    cart.forEach((item, index) => {

        let qty = item.quantity || item.qty || 1;
        let price = Number(item.price);
        let subtotal = price * qty;

        total += subtotal;

        message +=
            "Product " + (index + 1) + ": " + item.name + "%0A" +
            "Price: ₹" + price + "%0A" +
            "Quantity: " + qty + "%0A" +
            "Subtotal: ₹" + subtotal + "%0A%0A";
    });

    // 🧾 Add Total & Customer Info
    message +=
        "Total Amount: ₹" + total + "%0A%0A" +
        "Customer: " + firstName + " " + lastName + "%0A" +
        "Phone: " + phone + "%0A" +
        "Address: " + address + ", " + city + ", " + state + " - " + pincode;

    // 📱 Your WhatsApp Number (WITH COUNTRY CODE)
    const whatsappNumber = "918148772264";  // change if needed

    const url = "https://wa.me/" + whatsappNumber + "?text=" + message;

    // 🚀 Open WhatsApp
    const whatsappWindow = window.open(url, "_blank");
    setTimeout(() => {

    const popup = document.getElementById("orderStatusPopup");
    const title = document.getElementById("statusTitle");
    const messageBox = document.getElementById("statusMessage");

    // If WhatsApp window was opened
    if (whatsappWindow) {

        title.style.color = "green";
        title.innerText = "Order Placed Successfully! ✅";
        messageBox.innerText = "Your order has been sent via WhatsApp.";
        localStorage.removeItem("cart");

    } else {

        title.style.color = "red";
        title.innerText = "Order Declined ❌";
        messageBox.innerText = "WhatsApp did not open. Order cancelled.";
        

    }

    popup.style.display = "flex";

}, 2000);
    }
    function closeStatus(){
    document.getElementById("orderStatusPopup").style.display = "none";
}
    // 🧹 Clear Cart After Order
    
function goToPayment2(){
    window.location.href="payment2.html";
}


