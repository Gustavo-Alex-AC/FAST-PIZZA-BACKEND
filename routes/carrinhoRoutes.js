const express = require("express");
const router = express.Router();
const carrinhoController = require("../controllers/carrinhoController");

router.get("/", carrinhoController.getCarrinho);
router.post("/", carrinhoController.addItem);
router.patch("/:pizzaId", carrinhoController.updateQuantity);
router.delete("/limpar/:id_usuario", carrinhoController.limparCarrinho);
router.delete("/:pizzaId", carrinhoController.deleteItem);

module.exports = router;
