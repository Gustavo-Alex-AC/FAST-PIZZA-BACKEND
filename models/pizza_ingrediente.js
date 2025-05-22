module.exports = (sequelize, DataTypes) => {
  const PizzaIngrediente = sequelize.define(
    "Pizza_Ingrediente",
    {
      id_pizza: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      id_ingrediente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      tableName: "Pizza_Ingrediente",
      timestamps: false,
    }
  );

  return PizzaIngrediente;
};
