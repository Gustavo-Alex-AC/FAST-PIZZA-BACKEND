// app.js
const express = require("express");
const cors = require("cors");
const app = express();

const db = require("./models");

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/pizzas", require("./routes/pizzaRoutes"));
app.use("/api/pedidos", require("./routes/pedidoRoutes"));
app.use("/api/pagamentos", require("./routes/pagamentoRoutes"));
app.use("/api/tipopagamento", require("./routes/tipoPagamentoRoutes"));
app.use("/api/ingredientes", require("./routes/ingredienteRoutes"));
app.use("/api/carrinho", require("./routes/carrinhoRoutes"));

// Teste se conectou
db.sequelize.sync({ alter: true }).then(() => {
  console.log("📦 DB sincronizado com Sequelize");
});

module.exports = app;
