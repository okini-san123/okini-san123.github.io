const apiKey = "06655e4d-de9c-44fb-85d0-e535ac0cd1bf";
const notifications = document.getElementById("notifications");
const ordersBody = document.getElementById("orders-body");
const editModal = document.getElementById("edit-modal");
const deleteModal = document.getElementById("delete-modal");
const viewModal = document.getElementById("view-modal");
const editForm = document.getElementById("edit-form");
const viewContent = document.getElementById("view-content");
const editGoods = document.getElementById("edit-goods");
let currentOrderId = null;
let orders = []; // Хранение заказов
let goods = []; // Хранение товаров


function showNotification(message, type) {
  const notificationsArea = document.getElementById("notifications-area");
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

// Загрузка товаров
async function loadGoods() {
  try {
    const response = await fetch(
      `https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods?api_key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("Ошибка при загрузке товаров:", error);
    showNotification("Не удалось загрузить товары.", "error");
    return [];
  }
}

// Загрузка заказов
async function loadOrders() {
  try {
    const response = await fetch(
      `https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders?api_key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }

    orders = await response.json(); // Сохранение заказов
    goods = await loadGoods(); 

    renderOrders(orders, goods); 
  } catch (error) {
    console.error("Ошибка при загрузке заказов:", error);
    showNotification("Не удалось загрузить заказы.", "error");
  }
}

// Получение цены товара с учетом скидки
function getProductPrice(good) {
  if (!good) {
    console.error("Товар не найден.");
    return 0;
  }

  // Если есть скидка вычисляем итоговую цену формула actual_price - discount_price
  const price = good.discount_price > 0 ? good.actual_price - good.discount_price : good.actual_price;
  console.log(`Цена товара "${good.name}": ${price} ₽`);
  return price;
}

// Расчет стоимости доставки
function calculateDeliveryCost(date, time) {
  const deliveryDate = new Date(date);
  const dayOfWeek = deliveryDate.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; 
  const isEvening = time === "18:00-22:00"; 

  let deliveryCost = 200; 

  if (isWeekend && isEvening) {
    deliveryCost += 300; 
  } else if (isEvening) {
    deliveryCost += 200; 
  }

  console.log("День недели:", dayOfWeek);
  console.log("Выходной день:", isWeekend);
  console.log("Вечернее время:", isEvening);
  console.log("Итоговая стоимость доставки:", deliveryCost);

  return deliveryCost;
}

// расчет общей стоимости заказа товары + доставка
function calculateOrderTotal(order) {
  const totalProductsSum = order.good_ids.reduce((total, goodId) => {
    const good = goods.find((g) => g.id === goodId);
    if (!good) {
      console.error(`Товар с ID ${goodId} не найден.`);
      return total;
    }

    const quantity = order.quantities ? order.quantities[goodId] || 1 : 1; 
    const price = getProductPrice(good); 
    return total + price * quantity;
  }, 0);

  console.log("Сумма товаров:", totalProductsSum);

  // Стоимость доставки
  const deliveryCost = calculateDeliveryCost(order.delivery_date, order.delivery_interval);
  console.log("Стоимость доставки:", deliveryCost);

  // Общая сумма
  const totalSum = totalProductsSum + deliveryCost;
  console.log("Общая сумма заказа:", totalSum);

  return totalSum;
}

// Сокращение названия товара
function shortenName(name, maxLength = 20) {
  return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
}

// Отображение заказов в таблице
function renderOrders(orders, goods) {
  ordersBody.innerHTML = "";
  orders.forEach((order, index) => { 
    const orderGoods = order.good_ids
      .map((id) => {
        const good = goods.find((g) => g.id === id);
        return good ? `<span title="${good.name}">${shortenName(good.name)}</span>` : "Неизвестный товар";
      })
      .join(", ");

    const totalPrice = calculateOrderTotal(order);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td> 
      <td>${new Date(order.created_at).toLocaleString()}</td> 
      <td>${orderGoods}</td>
      <td>${totalPrice} ₽</td>
      <td>${order.delivery_date} (${order.delivery_interval})</td> 
      <td>
        <button class="view-btn" data-id="${order.id}">👁️</button>
        <button class="edit-btn" data-id="${order.id}">✏️</button>
        <button class="delete-btn" data-id="${order.id}">🗑️</button>
      </td>
    `;
    ordersBody.appendChild(row);
  });

  if (orders.length === 0) {
    showNotification("Заказов нет.", "info");
  }
}

function openViewModal(order) {
  const orderGoods = order.good_ids
    .map((id) => {
      const good = goods.find((g) => g.id === id);
      if (!good) return "";

      const price = getProductPrice(good);
      const quantity = order.quantities ? order.quantities[id] || 1 : 1; 
      const totalPrice = price * quantity;
      const originalPrice = good.discount_price > 0 ? good.actual_price : null;

      return `
        <li>
          <span title="${good.name}">${shortenName(good.name)}</span> - ${quantity} x ${price} ₽ = ${totalPrice} ₽
          ${originalPrice ? `<span class="original-price">${originalPrice} ₽</span>` : ""}
        </li>
      `;
    })
    .join("");

  const totalPrice = calculateOrderTotal(order);

  viewContent.innerHTML = `
    <h3>Заказ №${order.id}</h3>
    <p><strong>Имя:</strong> ${order.full_name}</p>
    <p><strong>Email:</strong> ${order.email}</p>
    <p><strong>Телефон:</strong> ${order.phone}</p>
    <p><strong>Адрес доставки:</strong> ${order.delivery_address}</p>
    <p><strong>Дата доставки:</strong> ${order.delivery_date}</p>
    <p><strong>Временной интервал:</strong> ${order.delivery_interval}</p>
    <p><strong>Комментарий:</strong> ${order.comment || "Нет комментария"}</p>
    <h4>Состав заказа:</h4>
    <ul>${orderGoods}</ul>
    <p><strong>Общая стоимость:</strong> ${totalPrice} ₽</p>
  `;
  viewModal.style.display = "flex";
}

function openEditModal(order) {
  currentOrderId = order.id;
  document.getElementById("edit-name").value = order.full_name;
  document.getElementById("edit-email").value = order.email;
  document.getElementById("edit-phone").value = order.phone;
  document.getElementById("edit-address").value = order.delivery_address;
  document.getElementById("edit-delivery-date").value = order.delivery_date;
  document.getElementById("edit-delivery-time").value = order.delivery_interval;
  document.getElementById("edit-comment").value = order.comment || "";

  // Очистка предыдущих товаров
  editGoods.innerHTML = "";

  // Добавление товаров в модальное окно
  const goodsList = document.createElement("ul");
  goodsList.className = "goods-list";
  order.good_ids.forEach((id) => {
    const good = goods.find((g) => g.id === id);
    if (good) {
      const quantity = order.quantities ? order.quantities[id] || 1 : 1;
      const price = getProductPrice(good);
      const totalPrice = price * quantity;

      const goodItem = document.createElement("li");
      goodItem.innerHTML = `
        <span title="${good.name}">${shortenName(good.name)}</span> - ${quantity} x ${price} ₽ = ${totalPrice} ₽
      `;
      goodsList.appendChild(goodItem);
    }
  });
  editGoods.appendChild(goodsList);

  const totalPrice = calculateOrderTotal(order);
  const totalPriceElement = document.createElement("div");
  totalPriceElement.className = "total-price";
  totalPriceElement.innerHTML = `<strong>Общая стоимость:</strong> ${totalPrice} ₽`;
  editGoods.appendChild(totalPriceElement);

  editModal.style.display = "flex";
}

document.querySelectorAll(".close-btn, .cancel-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    editModal.style.display = "none";
    deleteModal.style.display = "none";
    viewModal.style.display = "none";
  });
});

// Отправка формы редактирования
editForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const deliveryDateInput = document.getElementById("edit-delivery-date");
  const selectedDate = new Date(deliveryDateInput.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  if (selectedDate < today) {
    showNotification("Дата доставки не может быть в прошлом.", "error");
    return;
  }

  const formData = new FormData(editForm);
  const updatedData = {
    full_name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    delivery_address: formData.get("address"),
    delivery_date: formData.get("delivery-date"),
    delivery_interval: formData.get("delivery-time"),
    comment: formData.get("comment"),
  };

  try {
    const response = await fetch(
      `https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${currentOrderId}?api_key=${apiKey}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      throw new Error("Ошибка при обновлении заказа");
    }

    showNotification("Заказ успешно обновлен!", "success");
    editModal.style.display = "none";
    loadOrders(); 
  } catch (error) {
    showNotification("Не удалось обновить заказ.", "error");
  }
});

// Удаление заказа
document.querySelector(".confirm-btn").addEventListener("click", async () => {
  try {
    const response = await fetch(
      `https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${currentOrderId}?api_key=${apiKey}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Ошибка при удалении заказа");
    }

    showNotification("Заказ успешно удален!", "success");
    deleteModal.style.display = "none";
    loadOrders(); 
  } catch (error) {
    showNotification("Не удалось удалить заказ.", "error");
  }
});

ordersBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("view-btn")) {
    const orderId = e.target.getAttribute("data-id");
    const order = orders.find((o) => o.id === parseInt(orderId));
    if (order) {
      openViewModal(order);
    }
  }

  if (e.target.classList.contains("edit-btn")) {
    const orderId = e.target.getAttribute("data-id");
    const order = orders.find((o) => o.id === parseInt(orderId));
    if (order) {
      openEditModal(order);
    }
  }

  if (e.target.classList.contains("delete-btn")) {
    currentOrderId = e.target.getAttribute("data-id");
    deleteModal.style.display = "flex";
  }
});

// обработчик для закрытия в модальном окне с инфо
document.querySelector("#view-modal .close-btn-full").addEventListener("click", () => {
  viewModal.style.display = "none";
});

loadOrders();