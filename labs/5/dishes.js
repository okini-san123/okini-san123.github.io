const categories = ['soup', 'main', 'beverages', 'desserts', 'salads_starters'];

const dishes = [
    {
      keyword: "gazpacho",
      name: "Гаспачо",
      price: 195,
      category: "soup",
      weight: "350 г",
      image: "menu/soups/gazpacho.jpg",
      kind:"meat"
    },
    {
      keyword: "mushroom_soup",
      name: "Грибной суп-пюре",
      price: 185,
      category: "soup",
      weight: "330 г",
      image: "menu/soups/mushroom_soup.jpg",
      kind:"veg"
    },
    {
      keyword: "norwegian_soup",
      name: "Норвежский суп",
      price: 270,
      category: "soup",
      weight: "330 г",
      image: "menu/soups/norwegian_soup.jpg",
      kind:"veg"
    },
	{
      keyword: "ramen",
      name: "Рамен",
      price: 375,
      category: "soup",
      weight: "425 г",
      image: "menu/soups/ramen.jpg",
      kind:"meat"
    },
    {
      keyword: "tomyum",
      name: "Том ям с креветками",
      price: 650,
      category: "soup",
      weight: "500 г",
      image: "menu/soups/tomyum.jpg",
      kind:"fish"
    },
    {
      keyword: "chicken_soup",
      name: "Куриный суп",
      price: 330,
      category: "soup",
      weight: "350 г",
      image: "menu/soups/chicken.jpg",
      kind:"meat"
    },
	
	
    {
      keyword: "chicken_cutlets",
      name: "Котлеты из курицы с картофельным пюре",
      price: 225,
      category: "main",
      weight: "280 г",
      image: "menu/main_course/chickencutletsandmashedpotatoes.jpg",
      kind:"meat"
    },
    {
      keyword: "fried_potatoes",
      name: "Жареная картошка с грибами",
      price: 150,
      category: "main",
      weight: "250 г",
      image: "menu/main_course/friedpotatoeswithmushrooms1.jpg",
      kind:"veg"
    },
    {
      keyword: "lasagna",
      name: "Лазанья",
      price: 385,
      category: "main",
      weight: "310 г",
      image: "menu/main_course/lasagna.jpg",
      kind:"meat"
    },
	{
      keyword: "fishrice",
      name: "Рыбная котлета с рисом и спаржей",
      price: 320,
      category: "main",
      weight: "270 г",
      image: "menu/main_course/fishrice.jpg",
      kind:"fish"
    },
    {
      keyword: "pizza",
      name: "Пицца Маргарита",
      price: 450,
      category: "main",
      weight: "470 г",
      image: "menu/main_course/pizza.jpg",
      kind:"veg"
    },
    {
      keyword: "shrimppasta",
      name: "Паста с креветками",
      price: 340,
      category: "main",
      weight: "280 г",
      image: "menu/main_course/shrimppasta.jpg",
      kind:"fish"
    },
	
	
    {
      keyword: "apple_juice",
      name: "Яблочный сок",
      price: 90,
      category: "beverages",
      weight: "300 мл",
      image: "menu/beverages/applejuice.jpg",
      kind:"cold"
    },
    {
      keyword: "carrot_juice",
      name: "Морковный сок",
      price: 110,
      category: "beverages",
      weight: "300 мл",
      image: "menu/beverages/carrotjuice.jpg",
      kind:"cold"
    },
    {
      keyword: "orange_juice",
      name: "Апельсиновый сок",
      price: 120,
      category: "beverages",
      weight: "300 мл",
      image: "menu/beverages/orangejuice.jpg",
      kind:"cold"
    },
	{
      keyword: "cappuccino",
      name: "Капучино",
      price: 180,
      category: "beverages",
      weight: "300 мл",
      image: "menu/beverages/cappuccino.jpg",
      kind:"hot"
    },
    {
      keyword: "greentea",
      name: "Зеленый чай",
      price: 100,
      category: "beverages",
      weight: "300 мл",
      image: "menu/beverages/greentea.jpg",
      kind:"hot"
    },
    {
      keyword: "tea",
      name: "Чёрный чай",
      price: 90,
      category: "beverages",
      weight: "300 мл",
      image: "menu/beverages/tea.jpg",
      kind:"hot"
    },
	
	
	{
      keyword: "saladwithegg",
      name: "Корейский салат с овощами и яйцом",
      price: 330,
      category: "salads_starters",
      weight: "250 г",
      image: "menu/salads_starters/saladwithegg.jpg",
      kind:"veg"
    },
    {
      keyword: "caesar",
      name: "Цезарь с цыплёноком",
      price: 370,
      category: "salads_starters",
      weight: "220 г",
      image: "menu/salads_starters/caesar.jpg",
      kind:"meat"
    },
    {
      keyword: "caprese",
      name: "Капрезе с моцареллой",
      price: 350,
      category: "salads_starters",
      weight: "235 г",
      image: "menu/salads_starters/caprese.jpg",
      kind:"veg"
    },
	{
      keyword: "tunasalad",
      name: "Салат с тунцом",
      price: 480,
      category: "salads_starters",
      weight: "250 г",
      image: "menu/salads_starters/tunasalad.jpg",
      kind:"fish"
    },
    {
      keyword: "frenchfries1",
      name: "Картофель фри с соусом Цезарь",
      price: 280,
      category: "salads_starters",
      weight: "235 г",
      image: "menu/salads_starters/frenchfries1.jpg",
      kind:"veg"
    },
    {
      keyword: "frenchfries2",
      name: "Картофель фри с кетчупом",
      price: 260,
      category: "salads_starters",
      weight: "235 г",
      image: "menu/salads_starters/frenchfries2.jpg",
      kind:"veg"
    },
	
	
	{
      keyword: "baklava",
      name: "Пахвала",
      price: 220,
      category: "desserts",
      weight: "300 г",
      image: "menu/desserts/baklava.jpg",
      kind:"big"
    },
    {
      keyword: "checheesecake",
      name: "Чизкейк",
      price: 240,
      category: "desserts",
      weight: "125 г",
      image: "menu/desserts/checheesecake.jpg",
      kind:"small"
    },
    {
      keyword: "chocolatecheesecake",
      name: "Шоколадный чизкейк",
      price: 260,
      category: "desserts",
      weight: "125 г",
      image: "menu/desserts/chocolatecheesecake.jpg",
      kind:"small"
    },
	{
      keyword: "chocolatecake",
      name: "Шоколадный торт",
      price: 270,
      category: "desserts",
      weight: "140 г",
      image: "menu/desserts/chocolatecake.jpg",
      kind:"small"
    },
    {
      keyword: "donuts2",
      name: "Пончики (3 штуки)",
      price: 410,
      category: "desserts",
      weight: "350 г",
      image: "menu/desserts/donuts2.jpg",
      kind:"med"
    },
    {
      keyword: "donuts",
      name: "Пончики (6 штук)",
      price: 650,
      category: "desserts",
      weight: "700 г",
      image: "menu/desserts/donuts.jpg",
      kind:"big"
    },	
  ];
  