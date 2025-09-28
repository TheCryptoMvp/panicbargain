document.addEventListener("DOMContentLoaded", function() {
    let cartItems = [];

    // Detect Amazon Cart (Example)
    if (window.location.hostname.includes("amazon")) {
        let items = document.querySelectorAll(".sc-list-item-content");
        items.forEach(item => {
            let name = item.querySelector(".a-list-item span").innerText;
            let price = item.querySelector(".sc-price").innerText;
            cartItems.push({name, price});
        });
    }

    // Send Data to Background Script
    chrome.runtime.sendMessage({ action: "checkImpulse", cartItems });
});
