const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);
router.post("/criar-com-endereco", userController.criarUsuarioComEndereco);

router.get("/:id", userController.getUserById);
//router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
// Rota para login
router.post("/login", userController.login);

// Rota para registro
router.post("/register", userController.register);

module.exports = router;
