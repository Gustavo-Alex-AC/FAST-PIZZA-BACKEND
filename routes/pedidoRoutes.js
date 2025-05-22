const express = require("express");
const router = express.Router();
const controller = require("../controllers/pedidoController");

router.get("/", controller.getAllPedidos);
router.get("/:id", controller.getPedidoById);
router.post("/", controller.createPedido);
router.put("/:id", controller.updatePedido);
router.delete("/:id", controller.deletePedido);

module.exports = router;
