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

// POST /api/carrinho
exports.addItem = async (req, res) => {
  const { pizzaId, quantity, userId } = req.body;

  try {
    const [item, created] = await Carrinho.findOrCreate({
      where: { id_pizza: pizzaId, id_usuario: userId },
      defaults: { quantidade: quantity },
    });

    if (!created) {
      item.quantidade += quantity;
      await item.save();
    }

    res.status(201).json({ message: "Item adicionado", item });
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

// DELETE /api/carrinho/:pizzaId
exports.deleteItem = async (req, res) => {
  const { pizzaId } = req.params;

  try {
    const result = await Carrinho.destroy({ where: { id_pizza: pizzaId } });

    if (result === 0)
      return res.status(404).json({ message: "Item não encontrado" });

    res.json({ message: "Item removido" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao remover", error: err });
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
