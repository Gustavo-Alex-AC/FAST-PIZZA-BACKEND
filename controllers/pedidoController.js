const { Pedido } = require("../models");

exports.getAllPedidos = async (req, res) => {
  const pedidos = await Pedido.findAll();
  res.json(pedidos);
};

exports.getPedidoById = async (req, res) => {
  const pedido = await Pedido.findByPk(req.params.id);
  if (!pedido) return res.status(404).json({ error: "Pedido não encontrado" });
  res.json(pedido);
};

exports.createPedido = async (req, res) => {
  const pedido = await Pedido.create(req.body);
  res.status(201).json(pedido);
};

exports.updatePedido = async (req, res) => {
  const pedido = await Pedido.findByPk(req.params.id);
  if (!pedido) return res.status(404).json({ error: "Pedido não encontrado" });

  await pedido.update(req.body);
  res.json(pedido);
};

exports.deletePedido = async (req, res) => {
  const pedido = await Pedido.findByPk(req.params.id);
  if (!pedido) return res.status(404).json({ error: "Pedido não encontrado" });

  await pedido.destroy();
  res.json({ message: "Pedido removido com sucesso" });
};
