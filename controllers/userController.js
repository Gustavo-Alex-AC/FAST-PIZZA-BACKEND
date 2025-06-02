const { Usuario, Endereco } = require("../models");

exports.criarUsuarioComEndereco = async (req, res) => {
  try {
    const { nome, email, senha, tipo, rua, bairro, municipio, provincia } =
      req.body;

    // Primeiro, cria o usuário
    const usuario = await Usuario.create({
      nome,
      email,
      senha,
      tipo: tipo || "cliente",
    });

    // Depois, cria o endereço ligado ao usuário
    const endereco = await Endereco.create({
      rua,
      bairro,
      municipio,
      provincia,
      id_usuario: usuario.id, // vincula ao usuário criado
    });

    res.status(201).json({
      usuario,
      endereco,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar usuário com endereço" });
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await Usuario.findAll();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await Usuario.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "Usuário não encontrado" });
  res.json(user);
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
