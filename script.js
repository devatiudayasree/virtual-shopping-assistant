let cart = [];

const products = [
    {name:"Laptop", price:50000, stock:5, discount:10, image:"https://via.placeholder.com/200"},
    {name:"Phone", price:20000, stock:8, discount:5, image:"https://via.placeholder.com/200"},
    {name:"Headphones", price:3000, stock:0, discount:15, image:"https://via.placeholder.com/200"},
    {name:"Smart Watch", price:7000, stock:4, discount:12, image:"https://via.placeholder.com/200"},
    {name:"Tablet", price:25000, stock:6, discount:8, image:"https://via.placeholder.com/200"},
    {name:"Bluetooth Speaker", price:4000, stock:3, discount:20, image:"https://via.placeholder.com/200"},
    {name:"Keyboard", price:1500, stock:10, discount:5, image:"https://via.placeholder.com/200"},
    {name:"Mouse", price:800, stock:15, discount:3, image:"https://via.placeholder.com/200"},
    {name:"Power Bank", price:1200, stock:7, discount:10, image:"https://via.placeholder.com/200"},
    {name:"Camera", price:45000, stock:2, discount:18, image:"https://via.placeholder.com/200"},
    {name:"Gaming Console", price:35000, stock:1, discount:7, image:"https://via.placeholder.com/200"},
    {name:"Printer", price:9000, stock:0, discount:6, image:"https://via.placeholder.com/200"}
];

function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    document.getElementById("status").innerText = "Listening...";

    recognition.onresult = function(event) {
        const speech = event.results[0][0].transcript.toLowerCase();
        document.getElementById("status").innerText = "You said: " + speech;

        if(speech.includes("checkout")){
            simulatePayment();
        } else {
            speak("Searching for " + speech);
            showProducts(speech);
        }
    };
}

function speak(text){
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}

function manualSearch(){
    const input = document.getElementById("searchInput").value.toLowerCase();
    showProducts(input);
}

function showProducts(query){
    const productDiv = document.getElementById("products");
    productDiv.innerHTML = "";

    products.forEach(product=>{
        if(query.includes(product.name.toLowerCase())){

            const finalPrice = product.price - 
            (product.price * product.discount / 100);

            const stockMessage = product.stock > 0 
                ? "In Stock: " + product.stock 
                : "Out of Stock";

            const disabled = product.stock === 0 ? "disabled" : "";

            productDiv.innerHTML += `
                <div class="card">
                    <img src="${product.image}">
                    <h3>${product.name}</h3>
                    <p>Original: ₹${product.price}</p>
                    <p>Discount: ${product.discount}%</p>
                    <p><strong>Final: ₹${finalPrice}</strong></p>
                    <p>${stockMessage}</p>
                    <button ${disabled} onclick="addToCart('${product.name}')">
                        Add to Cart
                    </button>
                </div>
            `;
        }
    });
}

function addToCart(name){
    const product = products.find(p => p.name === name);

    if(product.stock > 0){
        cart.push(name);
        product.stock -= 1;
        updateCart();
        speak(name + " added to cart");
    } else {
        speak("Sorry, product is out of stock");
    }
}

function removeFromCart(index){
    const name = cart[index];
    const product = products.find(p => p.name === name);
    product.stock += 1;

    cart.splice(index,1);
    updateCart();
}

function updateCart(){
    const cartDiv = document.getElementById("cart");
    cartDiv.innerHTML = "";
    let total = 0;

    cart.forEach((item,index)=>{
        const product = products.find(p=>p.name===item);
        const finalPrice = product.price - 
        (product.price * product.discount / 100);

        total += finalPrice;

        cartDiv.innerHTML += 
        item + " <button onclick='removeFromCart("+index+")'>❌</button><br>";
    });

    document.getElementById("total").innerText = "Total: ₹" + total;
}

function simulatePayment(){
    if(cart.length === 0){
        speak("Cart is empty");
        return;
    }

    speak("Payment Successful. Thank you for shopping.");
    alert("Payment Successful!");
    cart = [];
    updateCart();
}

function toggleMode(){
    document.body.classList.toggle("dark");
}