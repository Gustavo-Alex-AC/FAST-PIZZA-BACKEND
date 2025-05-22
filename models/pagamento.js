module.exports = (sequelize, DataTypes) => {
  const Pagamento = sequelize.define("Pagamento", {
    metodo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pendente",
    },
    valor_pago: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    data_pagamento: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Pagamento.associate = (models) => {
    Pagamento.belongsTo(models.Pedido, {
      foreignKey: "pedidoId",
      as: "pedido",
    });

    Pagamento.belongsTo(models.TipoPagamento, {
      foreignKey: "tipoPagamentoId",
      as: "tipoPagamento",
    });
  };

  return Pagamento;
};
