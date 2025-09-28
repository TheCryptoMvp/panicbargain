document.addEventListener("DOMContentLoaded", function() {
    let adContainer = document.getElementById("ad-section");
    let adFrame = document.createElement("iframe");
    adFrame.src = "https://your-ad-network.com/ad-display";
    adFrame.width = "300";
    adFrame.height = "250";
    adContainer.appendChild(adFrame);
});
