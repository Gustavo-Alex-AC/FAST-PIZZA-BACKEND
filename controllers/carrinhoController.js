const { Carrinho, Pizza, Pedido } = require("../models");

// GET /api/carrinho
exports.getCarrinho = async (req, res) => {
  try {
    const items = await Carrinho.findAll({
      include: {
        model: Pizza,
        as: "pizza",
        attributes: ["id", "nome", "preco", "imageUrl"],
      },
    });

    const cart = items.map((item) => ({
      pizzaId: item.pizza.id,
      name: item.pizza.nome,
      quantity: item.quantidade,
      totalPrice: item.quantidade * parseFloat(item.pizza.preco),
      imageUrl: item.pizza.imageUrl,
    }));

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Erro ao obter carrinho", error: err });
  }
};

exports.getCarrinhoById = async (req, res) => {
  const { id_usuario } = req.params; // ou req.query.id_usuario

  if (!id_usuario) {
    return res.status(400).json({ message: "id_usuario é obrigatório" });
  }

  try {
    const items = await Carrinho.findAll({
      where: { id_usuario },
      include: {
        model: Pizza,
        as: "pizza",
        attributes: ["id", "nome", "preco", "imageUrl"],
      },
    });

    const cart = items.map((item) => ({
      pizzaId: item.pizza.id,
      name: item.pizza.nome,
      quantity: item.quantidade,
      totalPrice: item.quantidade * parseFloat(item.pizza.preco),
      imageUrl: item.pizza.imageUrl,
    }));

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Erro ao obter carrinho", error: err });
  }
};

// POST /api/carrinho
// controllers/cartController.js

exports.addItem = async (req, res) => {
  const { pizzaId, quantity, userId } = req.body;

  if (!pizzaId || !quantity || !userId) {
    return res.status(400).json({ message: "Dados incompletos" });
  }

  try {
    const [item, created] = await Carrinho.findOrCreate({
      where: { id_pizza: pizzaId, id_usuario: userId },
      defaults: { quantidade: quantity },
    });

    if (!created) {
      item.quantidade += quantity;
      await item.save();
    }

    res.status(201).json({ message: "Item adicionado ao carrinho", item });
  } catch (err) {
    console.error("Erro ao adicionar item:", err);
    res
      .status(500)
      .json({ message: "Erro ao adicionar item", error: err.message });
  }
};

// exports.addItem = async (req, res) => {
//   const { pizzaId, quantity, userId } = req.body;

//   try {
//     const [item, created] = await Carrinho.findOrCreate({
//       where: { id_pizza: pizzaId, id_usuario: userId },
//       defaults: { quantidade: quantity },
//     });

//     if (!created) {
//       item.quantidade += quantity;
//       await item.save();
//     }

//     res.status(201).json({ message: "Item adicionado", item });
//   } catch (err) {
//     res.status(500).json({ message: "Erro ao adicionar item", error: err });
//   }
// };

// PATCH /api/carrinho/:pizzaId
exports.updateQuantity = async (req, res) => {
  const { pizzaId } = req.params;
  const { quantity } = req.body;

  try {
    const item = await Carrinho.findOne({ where: { id_pizza: pizzaId } });
    if (!item) return res.status(404).json({ message: "Item não encontrado" });

    item.quantidade = quantity;
    await item.save();

    res.json({ message: "Quantidade atualizada", item });
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar", error: err });
  }
};

exports.deleteItem = async (req, res) => {
  const { pizzaId } = req.params;
  const { userId } = req.query;

  if (!userId) return res.status(400).json({ message: "userId é obrigatório" });

  try {
    const result = await Carrinho.destroy({
      where: {
        id_pizza: pizzaId,
        id_usuario: userId, // só apaga se for o dono
      },
    });

    if (result === 0)
      return res
        .status(404)
        .json({ message: "Item não encontrado ou não pertence ao usuário" });

    res.json({ message: "Item removido com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao remover item", error: err });
  }
};

exports.delete = async (req, res) => {
  try {
    await Carrinho.destroy({ where: {} });

    res.json({ message: "Item removido com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao remover item", error: err });
  }
};

// Limpar carrinho de um utilizador
exports.limparCarrinho = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    if (!id_usuario) {
      return res.status(400).json({ message: "ID do usuário é obrigatório." });
    }

    const deleted = await Carrinho.destroy({ where: { id_usuario } });

    if (deleted === 0) {
      return res
        .status(404)
        .json({ message: "Carrinho já está vazio para este usuário." });
    }

    res.status(204).end();
  } catch (error) {
    console.error("Erro ao limpar carrinho:", error);
    res.status(500).json({ message: "Erro ao limpar carrinho", error });
  }
};
