const {
  Pedido,
  Carrinho,
  Usuario,
  Pizza,
  Endereco,
  PedidoItem,
  Categoria,
  Tamanho,
  Ingrediente,
} = require("../models");

exports.criarPedido = async (req, res) => {
  try {
    const { total, id_usuario, carrinho } = req.body;

    const usuario = await Usuario.findByPk(id_usuario, {
      include: { model: Endereco, as: "endereco" },
    });

    if (!usuario || !usuario.endereco.length) {
      return res
        .status(400)
        .json({ message: "Endereço não encontrado para o utilizador." });
    }

    const enderecoPrincipal = usuario.endereco[0];

    const novoPedido = await Pedido.create({
      total,
      id_usuario,
      id_endereco: enderecoPrincipal.id,
      estado: "pendente",
    });

    for (const item of carrinho) {
      const pizza = await Pizza.findByPk(item.pizzaId, {
        include: [
          {
            model: Ingrediente,
            as: "ingredientes",
            through: { attributes: [] },
            attributes: ["descricao"],
          },
          {
            model: Categoria,
            as: "categoria",
            attributes: ["descricao"],
          },
          {
            model: Tamanho,
            as: "tamanho",
            attributes: ["descricao"],
          },
        ],
      });

      if (!pizza) continue;

      const ingredientes =
        pizza.ingredientes?.map((i) => i.descricao).join(", ") || "";

      await PedidoItem.create({
        id_pedido: novoPedido.id,
        quantidade: item.quantity,
        nome_pizza: pizza.nome,
        preco_unitario: pizza.preco,
        ingredientes,
        categoria: pizza.categoria?.descricao || "N/A",
        tamanho: pizza.tamanho?.descricao || "Médio",
        imagem: pizza.imageUrl,
      });
    }

    res.status(201).json({
      message: "Pedido criado com sucesso",
      pedidoId: novoPedido.id,
    });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ message: "Erro ao criar pedido", error });
  }
};

// Buscar todos os pedidos
exports.listarPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: PedidoItem,
          as: "itens",
          attributes: [
            "id",
            "nome_pizza",
            "quantidade",
            "preco_unitario",
            "ingredientes",
            "categoria",
            "tamanho",
            "imagem",
          ],
        },
        {
          model: Endereco,
          as: "endereco",
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nome", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(pedidos);
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    res.status(500).json({ message: "Erro ao listar pedidos", error });
  }
};

// Buscar pedido por ID (com itens fixos do momento da compra)
exports.buscarPedido = async (req, res) => {
  try {
    const { id } = req.params;

    const pedido = await Pedido.findByPk(id, {
      include: [
        {
          model: PedidoItem, // ou ItemPedido, depende do seu nome
          as: "itens",
          attributes: [
            "id",
            "quantidade",
            "nome_pizza",
            "ingredientes",
            "tamanho",
            "categoria",
            "preco_unitario",
          ],
        },
        {
          model: Endereco,
          as: "endereco",
        },
        {
          model: Usuario,
          as: "usuario",
          attributes: ["id", "nome", "email"],
        },
      ],
    });

    if (!pedido) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    res.status(200).json(pedido);
  } catch (error) {
    console.error("Erro ao buscar pedido:", error);
    res.status(500).json({ message: "Erro ao buscar pedido", error });
  }
};

// Atualizar estado do pedido
exports.atualizarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const pedido = await Pedido.findByPk(id);
    if (!pedido)
      return res.status(404).json({ message: "Pedido não encontrado" });

    pedido.estado = estado;
    await pedido.save();

    res.status(200).json({ message: "Pedido atualizado com sucesso", pedido });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar pedido", error });
  }
};

// Excluir pedido
exports.excluirPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findByPk(id);

    if (!pedido)
      return res.status(404).json({ message: "Pedido não encontrado" });

    await Carrinho.destroy({ where: { id_pedido: id } });
    await pedido.destroy();

    res.status(200).json({ message: "Pedido excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir pedido", error });
  }
};
