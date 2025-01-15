const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addresswarn = document.getElementById("address-warn")

let cart = [];

// ABRIR MODAL CARRINHO
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})
// FECHAR MODAL CARRINHO
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal)
     cartModal.style.display = "none"

})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
   
})

menu.addEventListener("click", function(event){
    // console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }

})
// FUNCAO PARA ADICONAR NO CARRINHO
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
    if(existingItem){
        // se o item ja existe aumenta apenas a quantidade
        existingItem.quantity += 1;

    }else{

        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    updateCartModal()
}

// ATUALIZA O CARRINHO
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
        <div>
        <p class="font-medium">${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>
        <button class="remove-from-cart-btn" data-name="${item.name}">
        Remover
        </button>

        </div>
        `
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
})

cartTotal.textContent = total.toLocaleString("PT-BR", {
    style: "currency",
    currency: "BRL"

});
cartCounter.innerHTML = cart.length;

}

// FUNCAO PARA REMOVER ITEM DO CARRINHO
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        removeItemCart(name);
    }

})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1){
        const item = cart[index];
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addresswarn.classList.add("hidden")
    
    }

})

// FINALIZAR PEDIDO

checkoutBtn.addEventListener("click", function(){

         const isOpen = checkRestauranteOpen();
         if(!isOpen){}
        //  Toastify({                                   //ALERTA PERSONALIZADO DE FECHADO
        //      text: "O restaurante está fechado.",
        //      duration: 3000,
        //      stopOnfocus: true,
        //      close: true,
        //      gravity: "top",
        //      position: "center",
        //      style: {
        //      background: " #ef4444",
        //  },
        //  }).showToast();
         return;


    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addresswarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;

    }

    // ENVIAR O PEDIDO PARA O WHATSAPP
    const cartItems = cart.map((item) =>{
        return (
            ` ${item.name} Quantidade: (${item.quantity}) preço: R$${item.price} |`
        )

    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "551166087062"
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart =[];
    updateCartModal();

    
})
   
// VERIFICAR O HORARIO DE FUNCIONAMENTO
function checkRestauranteOpen(){
    const date = new Date();
    const hora = date.getHours();
    return hora >=10 && hora < 22;
    // TRUE RESTAURANTE ESTA ABERTO
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestauranteOpen();
if(isOpen){
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}










