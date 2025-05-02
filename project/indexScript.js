let products = []; // Все загруженные товары
let cart = JSON.parse(localStorage.getItem("cart")) || []; // Корзина
let currentPage = 1; // Текущая страница
let totalProducts = 0; // Общее количество товаров
const perPage = 10; // Количество товаров на странице

const productGrid = document.getElementById("products-container");
const loadMoreButton = document.getElementById("load-more");
const filterForm = document.getElementById("filters");
const sortSelect = document.getElementById("sort-dropdown");
const notificationsArea = document.getElementById("notifications");

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

// Отображение уведомлений
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

// Загрузка товаров с API
async function fetchProducts(page = 1, perPage = 10, sortOrder = "rating_desc") {
  const apiUrl = 'https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods';
  const apiKey = '13787e1d-9d36-4fdb-a023-ad82bde2b60f';
  try {
    const response = await fetch(`${apiUrl}?api_key=${apiKey}&page=${page}&per_page=${perPage}&sort_order=${sortOrder}`);
    if (!response.ok) {
      throw new Error('Ошибка при загрузке данных');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    showNotification('Не удалось загрузить товары.', 'error');
    return { goods: [], _pagination: { current_page: 1, per_page: 10, total_count: 0 } };
  }
}

// Получение итоговой цены с учётом скидки
function getFinalPrice(product) {
  return product.discount_price > 0 ? product.actual_price - product.discount_price : product.actual_price;
}

// Отображение товаров
function renderProducts(productsToRender, clearGrid = true) {
  if (clearGrid) {
    productGrid.innerHTML = ""; 
  }
  productsToRender.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
      <img src="${product.image_url}" alt="${product.name}">
      <h3 class="name" title="${product.name}">${product.name}</h3>
      <div class="rating">${product.rating} ${getRatingStars(product.rating)}</div>
      <div class="price">
        <span class="discounted-price">${getFinalPrice(product)} ₽</span>
        ${product.discount_price > 0 ? `<span class="original-price">${product.actual_price} ₽</span>` : ""}
        ${product.discount_price > 0 ? `<span class="discount">-${Math.round((product.discount_price / product.actual_price) * 100)}%</span>` : ""}
      </div>
      <button class="add-to-cart" data-id="${product.id}">Добавить</button>
    `;
    productGrid.appendChild(productCard);
  });
}

// Обновление кнопки "Загрузить ещё"
function updateLoadMoreButton() {
  if (products.length >= totalProducts) {
    loadMoreButton.style.display = 'none'; 
  } else {
    loadMoreButton.style.display = 'block'; 
  }
}

// Сортировка всех товаров
function sortAllProducts() {
  const sortOrder = sortSelect.value;

  if (sortOrder === "price_asc") {
    products.sort((a, b) => getFinalPrice(a) - getFinalPrice(b)); // По возрастанию 
  } else if (sortOrder === "price_desc") {
    products.sort((a, b) => getFinalPrice(b) - getFinalPrice(a)); // По убыванию 
  }

  renderProducts(products); 
}

// Загрузка дополнительных товаров
async function loadMoreProducts() {
  currentPage += 1;
  const sortOrder = sortSelect.value; 
  const data = await fetchProducts(currentPage, perPage, sortOrder);
  if (data.goods.length > 0) {
    products = [...products, ...data.goods]; 
    sortAllProducts(); 
    updateLoadMoreButton();
  } else {
    showNotification('Больше товаров нет.', 'info');
  }
}

// Фильтрация товаров
function filterProducts() {
  const formData = new FormData(filterForm);
  const selectedCategories = formData.getAll("category");
  const minPrice = parseFloat(formData.get("price_min")) || 0;
  const maxPrice = parseFloat(formData.get("price_max")) || Infinity;
  const onlyDiscounted = formData.get("sales-only") === "on";

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.main_category);
    const matchesPrice = getFinalPrice(product) >= minPrice && getFinalPrice(product) <= maxPrice;
    const matchesDiscount = !onlyDiscounted || product.discount_price > 0;
    return matchesCategory && matchesPrice && matchesDiscount;
  });

  renderProducts(filteredProducts);
}

// Сортировка товаров
async function sortProducts() {
  const sortOrder = sortSelect.value;
  currentPage = 1; // Сброс страницы для сортировки
  const data = await fetchProducts(currentPage, perPage, sortOrder);

  if (data.goods.length > 0) {
    products = data.goods;
    totalProducts = data._pagination.total_count;
    sortAllProducts(); 
    updateLoadMoreButton();
    let sortMessage = "";
    switch (sortOrder) {
      case "rating_desc":
        sortMessage = "Товары отсортированы по убыванию рейтинга.";
        break;
      case "rating_asc":
        sortMessage = "Товары отсортированы по возрастанию рейтинга.";
        break;
      case "price_desc":
        sortMessage = "Товары отсортированы по убыванию цены.";
        break;
      case "price_asc":
        sortMessage = "Товары отсортированы по возрастанию цены.";
        break;
      default:
        sortMessage = "Сортировка применена.";
    }
    showNotification(sortMessage, "info");
  } else {
    showNotification('Не удалось загрузить товары.', 'error');
  }
}

// Добавление товара в корзину
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (product) {
    const isProductInCart = cart.some((item) => item.id === productId);
    if (isProductInCart) {
      showNotification(`Товар "${product.name}" уже в корзине.`, "error");
    } else {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      showNotification(`Товар "${product.name}" добавлен в корзину.`, "success");
    }
  }
}


// Обработчики событий
filterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  filterProducts();
});

sortSelect.addEventListener("change", () => {
  sortProducts();
});

productGrid.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const productId = parseInt(e.target.getAttribute("data-id"));
    addToCart(productId);
  }
});

loadMoreButton.addEventListener("click", loadMoreProducts);

// Инициализация
async function init() {
  const sortOrder = sortSelect.value; 
  const data = await fetchProducts(currentPage, perPage, sortOrder);
  if (data.goods.length > 0) {
    products = data.goods;
    totalProducts = data._pagination.total_count;
    sortAllProducts(); 
    updateLoadMoreButton();
  } else {
    showNotification('Не удалось загрузить товары.', 'error');
  }
}

document.addEventListener('DOMContentLoaded', init);