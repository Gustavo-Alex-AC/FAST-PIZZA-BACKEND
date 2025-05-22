module.exports = (sequelize, DataTypes) => {
  const Pizza = sequelize.define("Pizza", {
    nome: {
      // keep your portuguese naming or change to 'name' if you prefer
      type: DataTypes.STRING,
      allowNull: false,
    },
    preco: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true, // can be null if no image yet
    },
    soldOut: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  Pizza.associate = (models) => {
    Pizza.belongsTo(models.Categoria, {
      foreignKey: "id_categoria",
      as: "categoria",
    });

    Pizza.belongsTo(models.Tamanho, {
      foreignKey: "id_tamanho",
      as: "tamanho",
    });

    Pizza.belongsToMany(models.Ingrediente, {
      through: "Pizza_Ingrediente",
      foreignKey: "id_pizza",
      otherKey: "id_ingrediente",
      as: "ingredientes",
    });

    Pizza.hasMany(models.Carrinho, {
      foreignKey: "id_pizza",
      as: "carrinhos",
    });
  };

  return Pizza;
};
