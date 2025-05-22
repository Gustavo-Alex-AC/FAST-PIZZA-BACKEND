const { Ingrediente } = require("../models");

exports.getAllIngredientes = async (req, res) => {
  try {
    const ingredientes = await Ingrediente.findAll();
    res.json(ingredientes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar ingredientes", details: error.message });
  }
};

exports.getIngredienteById = async (req, res) => {
  try {
    const ingrediente = await Ingrediente.findByPk(req.params.id);
    if (!ingrediente) {
      return res.status(404).json({ error: "Ingrediente não encontrado" });
    }
    res.json(ingrediente);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar ingrediente", details: error.message });
  }
};

exports.createIngrediente = async (req, res) => {
  try {
    const ingrediente = await Ingrediente.create(req.body);
    res.status(201).json(ingrediente);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao criar ingrediente", details: error.message });
  }
};

exports.updateIngrediente = async (req, res) => {
  try {
    const ingrediente = await Ingrediente.findByPk(req.params.id);
    if (!ingrediente) {
      return res.status(404).json({ error: "Ingrediente não encontrado" });
    }

    await ingrediente.update(req.body);
    res.json(ingrediente);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar ingrediente", details: error.message });
  }
};

exports.deleteIngrediente = async (req, res) => {
  try {
    const ingrediente = await Ingrediente.findByPk(req.params.id);
    if (!ingrediente) {
      return res.status(404).json({ error: "Ingrediente não encontrado" });
    }

    await ingrediente.destroy();
    res.json({ message: "Ingrediente removido com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao deletar ingrediente", details: error.message });
  }
};
