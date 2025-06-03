module.exports = (sequelize, DataTypes) => {
  const Carrinho = sequelize.define("Carrinho", {
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
     id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  });

  Carrinho.associate = (models) => {
    Carrinho.belongsTo(models.Pizza, {
      foreignKey: "id_pizza",
      as: "pizza",
    });

    Carrinho.belongsTo(models.Pedido, {
      foreignKey: "id_pedido",
      as: "pedido",
    });

    Carrinho.belongsTo(models.Usuario, {
      foreignKey: "id_usuario",
      as: "usuario",
    });
  };

  return Carrinho;
};
