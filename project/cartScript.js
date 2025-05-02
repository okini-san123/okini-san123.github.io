const cartGrid = document.getElementById("cart-grid");
const emptyCartMessage = document.getElementById("empty-cart");
const notificationsArea = document.getElementById("notifications-area");
const checkoutForm = document.getElementById("checkout");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function getRatingStars(rating) {
  if (rating >= 5) {
    return "★★★★★";
  } else if (rating >= 3.5 && rating < 5) {
    return "★★★★☆";
  } else if (rating >= 2.5 && rating < 3.5) {
    return "★★★☆☆";
  } else if (rating >= 1.5 && rating < 2.5) {
    return "★★☆☆☆";
  } else if (rating >= 0.5 && rating < 1.5) {
    return "★☆☆☆☆";
  } else {
    return "☆☆☆☆☆";
  }
}

function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <span class="notification-message">${message}</span>
    <span class="close-btn">&times;</span>
  `;
  notificationsArea.appendChild(notification);

  // Показываем уведомление
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // Закрытие уведомления по клику на крестик
  const closeBtn = notification.querySelector(".close-btn");
  closeBtn.addEventListener("click", () => {
    notification.classList.add("hide");
    setTimeout(() => {
      notificationsArea.removeChild(notification);
    }, 500);
  });

  // Скрываем уведомление через 5 секунд
  setTimeout(() => {
    notification.classList.add("hide");
    setTimeout(() => {
      notificationsArea.removeChild(notification);
    }, 500);
  }, 5000);
}

// Отображение товаров в корзине
function renderCart() {
  cartGrid.innerHTML = "";

  if (cart.length === 0) {
    emptyCartMessage.style.display = "block";
    document.getElementById("total-sum").textContent = "0 ₽";
    return;
  }

  emptyCartMessage.style.display = "none";

  let totalSum = 0;
  cart.forEach((product) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
      <img src="${product.image_url}" alt="${product.name}">
      <h3 title="${product.name}">${product.name}</h3>
      <div class="rating">${product.rating} ${getRatingStars(product.rating)}</div>
      <div class="price">
        <span class="discounted-price">${product.actual_price - product.discount_price} ₽</span>
        ${product.discount_price > 0 ? `<span class="original-price">${product.actual_price} ₽</span>` : ""}
        ${product.discount_price > 0 ? `<span class="discount">-${Math.round((product.discount_price / product.actual_price) * 100)}%</span>` : ""}
      </div>
      <button class="remove-item" data-id="${product.id}">Удалить</button>
    `;
    cartGrid.appendChild(cartItem);

    totalSum += product.actual_price - product.discount_price;
  });

  updateTotalSum();
}

// Удаление товара из корзины
function removeFromCart(productId) {
  cart = cart.filter((product) => product.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateTotalSum();

  if (cart.length === 0) {
    showNotification("Корзина пуста.", "info"); 
  } else {
    showNotification("Товар удален из корзины.", "success");
  }
}

// Обработчик для удаления товара
cartGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-item")) {
    const productId = parseInt(e.target.getAttribute("data-id"));
    removeFromCart(productId);
  }
});

// Функция для расчета стоимости доставки
function calculateDeliveryCost(date, time) {
  const deliveryDate = new Date(date);
  const dayOfWeek = deliveryDate.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; 
  const isEvening = time === "18-22";

  let deliveryCost = 200; 

  if (isWeekend && isEvening) {
    deliveryCost += 300; 
  } else if (isEvening) {
    deliveryCost += 200; 
  }

  console.log("День недели:", dayOfWeek);
  console.log("Выходной день:", isWeekend);
  console.log("Вечернее время:", isEvening);
  console.log("Стоимость доставки:", deliveryCost);

  return deliveryCost;
}

// Обновление общей суммы
function updateTotalSum() {
  const deliveryDate = document.getElementById("delivery-date").value;
  const deliveryTime = document.getElementById("delivery-time").value;

  console.log("Дата доставки:", deliveryDate);
  console.log("Время доставки:", deliveryTime);

  if (!deliveryDate || !deliveryTime) {
    console.error("Дата или время доставки не выбраны.");
    return;
  }

  const totalProductsSum = cart.reduce((sum, product) => sum + (product.actual_price - product.discount_price), 0);
  const deliveryCost = calculateDeliveryCost(deliveryDate, deliveryTime);
  const totalSum = totalProductsSum + deliveryCost;

  console.log("Общая сумма товаров:", totalProductsSum);
  console.log("Общая сумма с доставкой:", totalSum);

  document.getElementById("total-sum").textContent = `${totalSum} ₽`;
}

// Обработчик для оформления заказа
checkoutForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    showNotification("Корзина пуста. Добавьте товары для оформления заказа.", "error");
    return;
  }

  // Собираем данные из формы
  const formData = new FormData(checkoutForm);
  const orderData = {
    full_name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subscribe: formData.get("subscribe") === "on",
    delivery_address: formData.get("address"),
    delivery_date: formatDate(formData.get("delivery-date")), 
    delivery_interval: convertDeliveryInterval(formData.get("delivery-time")), 
    comment: formData.get("comment"),
    good_ids: cart.map((product) => product.id), 
  };

  try {
    const apiKey = "06655e4d-de9c-44fb-85d0-e535ac0cd1bf";
    const response = await fetch(`https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders?api_key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error("Ошибка при оформлении заказа");
    }

    const result = await response.json();
    console.log("Заказ успешно оформлен:", result);

    // Очистка корзины
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));

    // Уведомление об успешном оформлении заказа
    showNotification("Заказ успешно оформлен!", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } catch (error) {
    console.error("Ошибка:", error);
    showNotification("Не удалось оформить заказ. Попробуйте снова.", "error");
  }
});

// Функция для форматирования даты 
function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Функция для конвертации интервала доставки
function convertDeliveryInterval(interval) {
  switch (interval) {
    case "9-12":
      return "08:00-12:00";
    case "12-15":
      return "12:00-14:00";
    case "15-18":
      return "14:00-18:00";
    case "18-22":
      return "18:00-22:00";
    default:
      return "08:00-12:00";
  }
}

// Обработчики событий для обновления общей суммы
document.getElementById("delivery-date").addEventListener("change", updateTotalSum);
document.getElementById("delivery-time").addEventListener("change", updateTotalSum);

// Инициализация страницы
renderCart();
updateTotalSum();