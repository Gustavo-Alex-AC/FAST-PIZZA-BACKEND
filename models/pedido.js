module.exports = (sequelize, DataTypes) => {
  const Pedido = sequelize.define("Pedido", {
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pendente",
    },
    data: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Pedido.associate = (models) => {
    Pedido.belongsTo(models.Usuario, {
      foreignKey: "id_usuario",
      as: "usuario",
    });

    Pedido.hasMany(models.Carrinho, {
      foreignKey: "id_pedido",
      as: "carrinho",
    });

    Pedido.hasOne(models.Pagamento, {
      foreignKey: "id_pedido",
      as: "pagamento",
    });
  };

  return Pedido;
};
