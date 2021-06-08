let productList = [];
let carrito = [];
let total = 0;
let order = {
    items: []
};

function add(productId, price){     /*La funcion add, sirve para añadir productos y console.log, para mostrar los productos y precios por consola  */
    const products = productList.find(p=> p.id ===productId);
    products.stock--;

    order.items.push(productList.find(p => p.id === productId));

    console.log(productId, price);
    carrito.push(productId);
    total = total + price;
    document.getElementById("checkout").innerHTML = `Carrito $${total}`;
    displayProducts();
}

function remove(productId, price) {
    const products = productList.find(p => p.id === productId);
    products.stock++; // devolvemos 1 al stock

    order.items.push(productList.find(p => p.id === productId));

    const index = carrito.findIndex(p => p.id == productId) // indice del producto a remover
    carrito.splice(index, 1); // removemos el producto del carrito.

    total = total - price; // descontamos el precio del producto que eliminamos.

    document.getElementById("checkout").innerHTML = `Carrito $${total}`
    displayProducts();
}

async function showOrder() { /* Con showOrder queremos es que se muestre el catalogo y se esconda la orden de lo que se ha pedido */
    document.getElementById("product-cards").style.display = "none";
    document.getElementById("order").style.display = "block";
    document.getElementById("slider").style.display = "none";
    document.getElementById("menu").style.display = "none";

    document.getElementById("order-total").innerHTML = `$${total}`;

    let productsHTML = `
    <tr>
        <th>Cantidad</th>
        <th>Detalle</th>
        <th>Subtotal</th>
    </tr>`
 ;
    order.items.forEach(p => {

        let buttonHTML = `<button class="button-add" onclick="add(${p.id},${p.price})">Agregar</button>`;

        if (p.stock <= 0) { /*Condicional para que se desactive el boton cuando no haya stock*/ 
           buttonHTML = `<button disabled class="button-add disabled" onclick="add(${p.id},${p.price})">Sin stock</button>`;
        }


        productsHTML +=`
        <tr>
            <th>1</th>
            <th>${p.name}</th>
            <th>${p.price}$</th>
        </tr>`

    });

    document.getElementById('order-table').innerHTML = productsHTML;

}

async function pay(){ 
    try{
        order.shipping = {
            nombre: document.getElementById('nombre').value,
            dni: document.getElementById('dni').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            banco: document.getElementById('banco').value,
            referencia: document.getElementById('referencia').value,
            total: document.getElementById('total').value
        }

       const productList = await (await fetch("/api/pay",{
            method: "post",
            body: JSON.stringify(order),
            headers: {
                "Content-Type": "application/json"
            }
        })).json(); 

        document.getElementById('nombre').disabled = true; /* Condicional para cuando se confirme el pago, no se pueda modificar lo ingresado en el formulario */
        document.getElementById('dni').disabled = true;
        document.getElementById('phone').disabled = true;
        document.getElementById('email').disabled = true;
        document.getElementById('banco').disabled = true;
        document.getElementById('referencia').disabled = true;
        document.getElementById('total').disabled = true;

        alert("El pedido ha sido enviado exitosamente")
    }
    catch {
        window.alert("Sin stock");
    }

    carrito = [];
    total = 0;
    order = {
        items: []
    };
    //await fetchProducts();
    document.getElementById("checkout").innerHTML = `Carrito $${total}`
}

//-----
function displayProducts() { /* Esta funcion va a iterar por todos los productos y nos va a generar los artículos que están en el index.html */
    document.getElementById("product-cards").style.display = "flex";
    document.getElementById("order").style.display = "none";

    let productsHTML = '';
    productList.forEach(p => {
        let buttonHTML = `<button class="button-add" onclick="add(${p.id},${p.price})">Agregar</button>`;
        let buttonHTMLRemove = `<button class="button-remove" onclick="remove(${p.id},${p.price})">Quitar</button>`;


        if (p.stock <= 0) { /*Condicional para que se desactive el boton cuando no haya stock*/ 
           buttonHTML = `<button disabled class="button-add disabled" onclick="add(${p.id},${p.price})">Sin stock</button>`;
        } 

        if (total <= 0) { /*Condicional para que se desactive el boton cuando no haya stock*/ 
            buttonHTMLRemove = `<button disabled class="button-remove disabled" onclick="remove(${p.id},${p.price})">Quitar</button>`;
         } 


        productsHTML +=
    `<div class="product-container">         <!--Recuadro que contiene los datos e imagen del artículo-->
        <h3>${p.name}</h3>
        <img src="${p.image}">
        <h1>$${p.price}</h1>
        ${buttonHTMLRemove}
        ${buttonHTML}
    </div>`
    });
    document.getElementById('product-cards').innerHTML = productsHTML; 
}


async function fetchProducts(){
    productList = await (await fetch("/api/products")).json();
    displayProducts();
}

window.onload = async() => { /* Nos enseña en la consola el arreglo de los productos y se muestran por pantalla cuando el navegador carga*/
    await fetchProducts();
}

