const express = require("express");
const router = express.Router();
const controller = require("../controllers/pizzaController");

router.get("/", controller.getAllPizzas);
router.get("/:id", controller.getPizzaById);
router.post("/", controller.createPizza);
router.put("/:id", controller.updatePizza);
router.delete("/:id", controller.deletePizza);

module.exports = router;
