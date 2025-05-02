let orderList = {
}


function add(button) {
    dish = dishes.find(dish => {
        return dish.keyword == button.getAttribute('data-keyword') 
    })
    orderList[dish.category] = dish;
    highlight(button);
    update_order_list();
}

function highlight(button){
    button.closest('.menu-grid').querySelectorAll('.add-button').forEach(btn => btn.closest('.menu-item').classList.remove('active'));
    button.closest('.menu-item').classList.add('active');
}

function update_order_list(){

    const soupSection = document.getElementById('soup-selection');
    const mainSection = document.getElementById('main-selection');
    const beveragesSection = document.getElementById('beverages-selection');
    const totalPrice  = document.getElementById('total-price');
    let dishWasSelected = false;

    if(!dishWasSelected){
        const noDishSelected = document.getElementById('no-order');
        const orderBody = document.getElementById('order-body');
        noDishSelected.classList.add('hidden');
        orderBody.classList.remove('hidden');
    }

    if (orderList.soup) {
        soupSection.innerHTML = `${orderList.soup.name} - ${orderList.soup.price} ₽`;
    } 

    if (orderList.main) {
        mainSection.innerHTML = `${orderList.main.name} - ${orderList.main.price} ₽`;
    }

    if (orderList.beverages) {
        beveragesSection.innerHTML =`${orderList.beverages.name} - ${orderList.beverages.price} ₽`;
    }

    totalPrice.innerHTML = `${calculateTotalPrice()} ₽`;
}

function calculateTotalPrice(){
    const total = Object.values(orderList).reduce((sum, dish) => {
        return sum + dish.price;
    }, 0);
    return total;
}