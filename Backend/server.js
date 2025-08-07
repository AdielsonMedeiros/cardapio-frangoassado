const express = require("express");
const app = express();
const cors = require("cors");
const { MercadoPagoConfig, Preference } = require("mercadopago");


require('dotenv').config();

app.use(cors());
app.use(express.json());


const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});



app.post("/create_preference", async (req, res) => {

});

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port} `);
});