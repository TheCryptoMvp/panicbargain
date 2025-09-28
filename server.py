from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

# UK Shopping APIs
SHOPPING_APIS = {
    "eBay": "https://api.ebay.com/buy/browse/v1/item_summary/search?q=",
    "Amazon UK": "https://api.amazonservices.co.uk/products?searchTerm=",
    "Groupon UK": "https://api.groupon.co.uk/deals?query="
}

# Web Scraping-based UK shopping sites
SHOPPING_SITES = [
    "https://www.argos.co.uk/search/",
    "https://www.currys.co.uk/gbuk/search-keywords/xx_xx_xx_xx_xx/",
    "https://www.johnlewis.com/search?search-term=",
    "https://www.tesco.com/groceries/en-GB/search?query=",
    "https://www.very.co.uk/search/"
]

def scrape_price(url):
    """Scrapes product prices from a given UK shopping website."""
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    price_tags = soup.find_all("span", class_="price")  # Adjust class names as needed
    prices = [float(tag.text.replace("£", "").strip()) for tag in price_tags if tag.text.startswith("£")]

    return min(prices) if prices else None

def find_cheapest_alternatives(query):
    """Finds and returns the cheapest available alternatives."""
    alternatives = []

    # Query official APIs
    for site, api_url in SHOPPING_APIS.items():
        response = requests.get(api_url + query)
        data = response.json()
        for item in data.get("items", []):
            alternatives.append({"name": item["title"], "price": item["price"], "link": item["url"]})

    # Scrape alternative sites
    for site in SHOPPING_SITES:
        search_url = f"{site}{query.replace(' ', '+')}"
        price = scrape_price(search_url)
        if price:
            alternatives.append({"name": query, "price": price, "link": search_url})

    # Sort by price (cheapest first) and pick top 3
    alternatives = sorted(alternatives, key=lambda x: x["price"])[:3]

    return alternatives

@app.route("/analyze", methods=["POST"])
def analyze_cart():
    data = request.json
    query = data["items"][0]["name"]
    alternatives = find_cheapest_alternatives(query)
    return jsonify({"impulseDetected": True, "alternatives": alternatives})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
