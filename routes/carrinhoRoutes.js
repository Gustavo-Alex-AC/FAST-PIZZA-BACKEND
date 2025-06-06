const express = require("express");
const router = express.Router();
const carrinhoController = require("../controllers/carrinhoController");

router.get("/", carrinhoController.getCarrinho);
router.get("/:id_usuario", carrinhoController.getCarrinhoById);
router.post("/", carrinhoController.addItem);
router.patch("/:pizzaId", carrinhoController.updateQuantity);
router.delete("/limpar/:id_usuario", carrinhoController.limparCarrinho);
router.delete("/:pizzaId", carrinhoController.deleteItem);
router.delete("/", carrinhoController.delete);

module.exports = router;
