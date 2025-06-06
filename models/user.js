module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define("Usuario", {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sobrenome: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING,
      defaultValue: "cliente", // ou "admin", dependendo do seu sistema
    },
  });

  Usuario.associate = (models) => {
    Usuario.hasMany(models.Pedido, {
      foreignKey: "id_usuario",
      as: "pedidos",
    });

    Usuario.hasMany(models.Endereco, {
      foreignKey: "id_usuario",
      as: "endereco", // pode manter esse alias se quiser
    });
    Usuario.hasMany(models.Carrinho, {
      foreignKey: "id_usuario",
      as: "carrinho", // pode manter esse alias se quiser
    });
  };

  return Usuario;
};
