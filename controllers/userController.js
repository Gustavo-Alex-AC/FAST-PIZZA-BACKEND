const { Usuario } = require("../models");

exports.getAllUsers = async (req, res) => {
  const users = await Usuario.findAll();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await Usuario.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  res.json(user);
};

exports.createUser = async (req, res) => {
  const user = await Usuario.create(req.body);
  res.status(201).json(user);
};

exports.updateUser = async (req, res) => {
  const user = await Usuario.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  await user.update(req.body);
  res.json(user);
};

exports.deleteUser = async (req, res) => {
  const user = await Usuario.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

  await user.destroy();
  res.json({ message: "Usuário removido com sucesso" });
};
