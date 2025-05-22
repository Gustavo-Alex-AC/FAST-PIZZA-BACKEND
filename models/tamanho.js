module.exports = (sequelize, DataTypes) => {
  const Tamanho = sequelize.define("Tamanho", {
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Tamanho.associate = (models) => {
    Tamanho.hasMany(models.Pizza, {
      foreignKey: "id_tamanho",
      as: "pizzas",
    });
  };

  return Tamanho;
};
