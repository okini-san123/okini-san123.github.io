const preSortedDish = new Map();

document.addEventListener("DOMContentLoaded", () => {
    dishes.sort((a, b) => a.name.localeCompare(b.name));
    fillHtmlPage(dishes);
    fillPreSortedDish(dishes);
  });


document.addEventListener('DOMContentLoaded', () => {
  const radios = document.querySelectorAll('.radio-toolbar input[type="radio"]');
  const selectedRadios = {}

  radios.forEach((radio) => {
    radio.addEventListener('click', () => {

      const kind = radio.getAttribute('data-kind');
      const category = radio.closest('.radio-toolbar').getAttribute('data-category');

      if (selectedRadios[category] == kind){
          radio.checked = false;
          selectedRadios[category] = null;
          fillHtmlCategory(dishes, category);
      } else if (selectedRadios[category] != kind){
          radio.closest('.radio-toolbar').querySelectorAll('input[type="radio"]').forEach((r) => {
            r.checked = false;
          })
          radio.checked = true;
          selectedRadios[category] = kind;
          fillHtmlCategory(preSortedDish[kind], category);
      }

    });
  });
});


function fillPreSortedDish(dishes){
  dishes.forEach((dish) => {
    if(!preSortedDish[dish.kind]){
      preSortedDish[dish.kind] = [dish];
    }
    else{
      preSortedDish[dish.kind].push(dish);
    }
  });
}


function fillHtmlPage(dishes){
  categories.forEach((cat) => {
    fillHtmlCategory(dishes, cat);
  })

}

function fillHtmlCategory(dishes, category){
  block = document.querySelector(`.${category} .menu-grid`);
  block.innerHTML = ``;
  dishes.forEach((dish) => {
    if (dish.category == category){
      block.appendChild(createDishElement(dish));
    }
  });
}

function createDishElement(dish){
  const dishElement = document.createElement("div");
  dishElement.classList.add("menu-item");
  dishElement.innerHTML = `
  <img src="${dish.image}" alt="${dish.name}">
  <p class="price">${dish.price} ₽</p>
  <p class="name">${dish.name}</p>
  <p class="weight">${dish.weight}</p>
  <button onclick="add(this)" class="add-button" data-keyword="${dish.keyword}">Добавить</button>
`;
  return dishElement;
}

