document.addEventListener("DOMContentLoaded", () => {
    const sections = {
      soup: document.querySelector(".soup .menu-grid"),
      main: document.querySelector(".main .menu-grid"),
      beverages: document.querySelector(".beverages .menu-grid"),
    };
    
    dishes.sort((a, b) => a.name.localeCompare(b.name));

    dishes.forEach((dish) => {
      const dishElement = document.createElement("div");
      dishElement.classList.add("menu-item");
  
      dishElement.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}">
        <p class="price">${dish.price} ₽</p>
        <p class="name">${dish.name}</p>
        <p class="weight">${dish.weight}</p>
        <button onclick="add(this)" class="add-button" data-keyword="${dish.keyword}">Добавить</button>
      `;
  
        sections[dish.category].appendChild(dishElement);
    });
  });
  