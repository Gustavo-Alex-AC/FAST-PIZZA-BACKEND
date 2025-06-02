const express = require("express");
const router = express.Router();
const controller = require("../controllers/pedidoController");

router.post("/", controller.criarPedido);
router.get("/", controller.listarPedidos);
router.get("/:id", controller.buscarPedido);
router.put("/:id", controller.atualizarPedido);
router.delete("/:id", controller.excluirPedido);

module.exports = router;
