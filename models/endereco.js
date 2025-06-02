module.exports = (sequelize, DataTypes) => {
  const Endereco = sequelize.define("Endereco", {
    rua: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bairro: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    municipio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provincia: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Endereco.associate = (models) => {
    Endereco.belongsTo(models.Usuario, {
      foreignKey: "id_usuario",
      as: "usuario",
    });

    Endereco.hasMany(models.Pedido, {
      foreignKey: "id_endereco",
      as: "pedidos",
    });
  };

  return Endereco;
};
