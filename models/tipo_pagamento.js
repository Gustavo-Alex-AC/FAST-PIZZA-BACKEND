module.exports = (sequelize, DataTypes) => {
  const TipoPagamento = sequelize.define("TipoPagamento", {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  TipoPagamento.associate = (models) => {
    TipoPagamento.hasMany(models.Pagamento, {
      foreignKey: "tipoPagamentoId", // <-- CORRIGIDO!
      as: "pagamentos",
    });
  };

  return TipoPagamento;
};
