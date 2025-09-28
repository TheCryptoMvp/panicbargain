document.addEventListener("DOMContentLoaded", function () {
    let countdown = 30;
    let timerElement = document.getElementById("cooldown-timer");
    let bypassButton = document.getElementById("bypass-button");
    let alternativesList = document.getElementById("alternatives-list");

    // Start countdown timer
    let countdownInterval = setInterval(() => {
        countdown--;
        timerElement.innerText = countdown;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            bypassButton.disabled = false;
        }
    }, 1000);

    // Allow checkout after cooldown
    bypassButton.addEventListener("click", function () {
        alert("Proceed with caution! Don't waste your money.");
    });

    // Simulated product search (Replace with real shopping cart data)
    let productName = "Samsung Galaxy S21"; // This should come from the shopping cart
    let productPrice = 699.99; // Original item price

    // Fetch alternative suggestions from AI server
    fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ name: productName, price: productPrice }] })
    })
    .then(response => response.json())
    .then(data => {
        alternativesList.innerHTML = "";  // Clear loading message
        if (data.alternatives && data.alternatives.length > 0) {
            data.alternatives.forEach(item => {
                let listItem = document.createElement("li");
                listItem.innerHTML = `<a href="${item.link}" target="_blank">🔗 ${item.name} - $${item.price}</a>`;
                alternativesList.appendChild(listItem);
            });
        } else {
            alternativesList.innerHTML = "<li>No cheaper alternatives found.</li>";
        }
    })
    .catch(error => {
        console.error("Error fetching alternatives:", error);
        alternativesList.innerHTML = "<li>⚠️ Error loading suggestions. Please try again.</li>";
    });
});
