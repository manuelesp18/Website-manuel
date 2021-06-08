const express = require('express'); /* Framework usado para Node */
const bodyParser = require("body-parser");
const repository = require("./repository");
const app = express(); /* Inicializa la aplicacion */
const port = 3000; /* Se va a iniciar en el puerto 3000 */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/api/products', async (req, res) => { /* La aplicacion cuando hace un get, va a retornar los productos */
  res.send(await repository.read());
});

app.post('/api/pay', async (req, res) => {
  const order = req.body;
  const ids = order.items.map(p=> p.id);                            /* Mandamos una lista de id */
  const productsCopy = await repository.read();

  let error = false;
  ids.forEach((id) => {
    const product = productsCopy.find((p) => p.id === id);   /* De esta manera se obtiene el producto que corresponde al ID */
    if (product.stock > 0) {
      product.stock--;
    } else {
      error = true;
    }
  });

  if (error) {
    res.send("Sin stock").statusCode(400);
  }
  else {
      await repository.write(productsCopy);
      order.date = new Date().toISOString();
      const orders = await repository.readOrders();
      orders.push(order);
      await repository.writeOrders(orders);
      res.send(productsCopy);
  }
});

app.use("/", express.static("fe")); /* cuando en la barra esté /, nos va a mostrar los archivos estáticos, si sale /api/products, nos aparece los productos en js */

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});