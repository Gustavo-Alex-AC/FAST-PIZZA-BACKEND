module.exports = (sequelize, DataTypes) => {
  const Categoria = sequelize.define("Categoria", {
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Categoria.associate = (models) => {
    Categoria.hasMany(models.Pizza, {
      foreignKey: "id_categoria",
      as: "pizzas",
    });
  };

  return Categoria;
};
