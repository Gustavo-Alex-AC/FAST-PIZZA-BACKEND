module.exports = (sequelize, DataTypes) => {
  const Ingrediente = sequelize.define("Ingrediente", {
    descricao: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Ingrediente.associate = (models) => {
    Ingrediente.belongsToMany(models.Pizza, {
      through: "Pizza_Ingrediente",
      foreignKey: "id_ingrediente",
      otherKey: "id_pizza",
      as: "pizzas",
    });
  };

  return Ingrediente;
};
