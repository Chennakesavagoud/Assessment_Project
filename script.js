document.addEventListener("DOMContentLoaded", () => {
  const apiURL = "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";
  const cartItemsContainer = document.querySelector(".cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");

  fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      populateCart(data.items);
      updateTotals(data.original_total_price);
    })
    .catch((error) => console.error("Error fetching cart data:", error));

  function populateCart(items) {
    items.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="details">
          <h3>${item.title}</h3>
          <p>Rs: ₹${(item.price / 100).toFixed(2)}</p>
          <p>Rs: ₹<span class="line-total">${(item.line_price / 100).toFixed(2)}</span></p>
        </div>
        <input type="number" value="${item.quantity}" min="1" data-price="${item.price}">
        <button class="remove-btn">🗑</button>
      `;

      cartItemsContainer.appendChild(cartItem);

      cartItem.querySelector("input").addEventListener("change", (e) => {
        const quantity = parseInt(e.target.value);
        const price = parseInt(e.target.dataset.price);
        const lineTotal = (price * quantity) / 100;

        cartItem.querySelector(".line-total").textContent = lineTotal.toFixed(2);
        updateTotals();
      });

      cartItem.querySelector(".remove-btn").addEventListener("click", () => {
        cartItem.remove();
        updateTotals();
      });
    });
  }

  function updateTotals() {
    let subtotal = 0;
    document.querySelectorAll(".line-total").forEach((lineTotal) => {
      subtotal += parseFloat(lineTotal.textContent);
    });

    subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    totalEl.textContent = `₹${subtotal.toFixed(2)}`;
  }
});
