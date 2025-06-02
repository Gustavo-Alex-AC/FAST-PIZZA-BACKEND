// models/PedidoItem.js
module.exports = (sequelize, DataTypes) => {
  const PedidoItem = sequelize.define("PedidoItem", {
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nome_pizza: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preco_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    ingredientes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tamanho: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imagem: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  PedidoItem.associate = function (models) {
    PedidoItem.belongsTo(models.Pedido, {
      foreignKey: "id_pedido",
      as: "pedido",
    });
  };

  return PedidoItem;
};
