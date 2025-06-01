// controllers/pizzaController.js
const { Pizza, Ingrediente, Categoria, Tamanho } = require("../models");

exports.getAllPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.findAll({
      include: [
        {
          model: Categoria,
          as: "categoria",
          attributes: ["id", "descricao"], // corrigido
        },
        {
          model: Tamanho,
          as: "tamanho",
          attributes: ["id", "descricao"], // corrigido
        },
        {
          model: Ingrediente,
          as: "ingredientes",
          through: { attributes: [] }, // omitindo a tabela intermediária
          attributes: ["id", "descricao"],
        },
      ],
    });

    const formattedPizzas = pizzas.map((pizza) => ({
      id: pizza.id,
      name: pizza.nome,
      ingredients: pizza.ingredientes.map((i) => i.descricao), // 👈 mesmo alias aqui
      soldOut: pizza.soldOut,
      imageUrl: pizza.imageUrl,
      unitPrice: pizza.preco,
      category: pizza.categoria?.descricao || null,
      size: pizza.tamanho?.descricao || null,
    }));

    res.json(formattedPizzas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar pizzas" });
  }
};

exports.getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findByPk(req.params.id);
    if (!pizza) {
      return res.status(404).json({ error: "Pizza não encontrada" });
    }
    res.json(pizza);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar pizza", details: error.message });
  }
};

exports.createPizza = async (req, res) => {
  try {
    const pizza = await Pizza.create(req.body);
    res.status(201).json(pizza);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao criar pizza", details: error.message });
  }
};

exports.updatePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByPk(req.params.id);
    if (!pizza) {
      return res.status(404).json({ error: "Pizza não encontrada" });
    }

    await pizza.update(req.body);
    res.json(pizza);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar pizza", details: error.message });
  }
};

exports.deletePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByPk(req.params.id);
    if (!pizza) {
      return res.status(404).json({ error: "Pizza não encontrada" });
    }

    await pizza.destroy();
    res.json({ message: "Pizza removida com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar pizza", details: error.message });
  }
};
