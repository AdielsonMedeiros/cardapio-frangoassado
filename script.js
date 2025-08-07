const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const button = document.querySelectorAll('.myButton')


button.forEach(button => {
  button.addEventListener('click', function() {
    this.classList.add('bg-neutral-600');

  setTimeout(() => {
  
    this.classList.remove('bg-neutral-600'); // Adiciona a classe transparente novamente
  }, 130);
});
});



let cart = [];
cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";
  updateCartModal();
});

cartModal.addEventListener("click", function (evento) {
  if (evento.target === cartModal) {
    cartModal.style.display = "none";
  }
});
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

menu.addEventListener("click", function (evento) {
  let parentButton = evento.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));

    // add no carrinho
    addToCart(name, price);
  }
});

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    cartItemElement.innerHTML = `
        
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class ="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>
            <button class="remove-from-cart-btn" data-name="${
              item.name
            }" > Remover </button>
        </div>
        
        
        `;

    cartItemsContainer.appendChild(cartItemElement);

    total += item.price * item.quantity;
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");

    removeItemCart(name);
  }
});

function removeItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
      updateCartModal();
      return;
    }

    cart.splice(index, 1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});



checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();
  if (isOpen) {
    Toastify({
      text: "Ops o restaurante está fechado!",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #ef4444, #b91c1c)",
      },
    }).showToast();
    return;
  }

  if (cart.length === 0) return;

  if (addressInput.value === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }


  checkoutBtn.disabled = true;
  checkoutBtn.innerHTML = "Processando...";

  fetch("http://localhost:3000/create_preference", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: cart,
    }),
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Falha na rede ou no servidor.");
      }
      return response.json();
    })
    .then(function (preference) {
      window.location.href = preference.init_point;
    })
    .catch(function (error) {
      alert("Ops, ocorreu um erro ao processar seu pagamento. Tente novamente.");
      console.error(error);
    
      checkoutBtn.disabled = false;
      checkoutBtn.innerHTML = "Finalizar pedido";
    });
});

function checkRestaurantOpen() {
  const data = new Date();
  const diaDaSemana = data.getDay();
  const hora = data.getHours();
  const minuto = data.getMinutes();
  const totalMinutos = hora * 60 + minuto;
  const inicio = 7 * 60; // 7 da manhã
  const fim = 15 * 60; // 15 da tarde


  return diaDaSemana === 0 && totalMinutos >= inicio && totalMinutos < fim;
}
const aWpp = document.getElementById("date-a-wpp");
const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-500");
  aWpp.classList.remove("bg-red-500");
  aWpp.classList.add("bg-green-500");
} else {
  spanItem.classList.remove("bg-green-500");
  spanItem.classList.add("bg-red-500");
  aWpp.classList.remove("bg-green-500");
  aWpp.classList.add("bg-red-500");
}
