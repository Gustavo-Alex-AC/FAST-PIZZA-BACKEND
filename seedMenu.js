const {
  sequelize,
  Pizza,
  Categoria,
  Tamanho,
  Ingrediente,
} = require("./models");

const pizzasData = [
  {
    nome: "Margherita",
    preco: 12.0,
    imagem:
      "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/pizzas/pizza-1.jpg",
    ingredientes: ["tomato", "mozzarella", "basil"],
    soldOut: false,
    descricao: "Pizza tradicional italiana com queijo e manjericão",
  },
  {
    nome: "Capricciosa",
    preco: 14.0,
    imagem:
      "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/pizzas/pizza-2.jpg",
    ingredientes: ["tomato", "mozzarella", "ham", "mushrooms", "artichoke"],
    soldOut: true,
    descricao: "Pizza clássica com presunto e cogumelos",
  },
];

async function seedPizzaNormalized() {
  try {
    await sequelize.sync({ force: true });

    // Categoria table - category for pizzas
    const categoriaPizza = await Categoria.create({
      descricao: "Vegetariana",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Tamanho table - size
    const tamanhoMedia = await Tamanho.create({
      descricao: "Média",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const tamanhoGrande = await Tamanho.create({
      descricao: "Grande",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Ingrediente table - unique ingredients
    const uniqueIngredientes = new Set();
    pizzasData.forEach((pizza) =>
      pizza.ingredientes.forEach((ing) => uniqueIngredientes.add(ing))
    );

    const ingredienteMap = {};
    for (const descricao of uniqueIngredientes) {
      const ingrediente = await Ingrediente.create({
        descricao,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      ingredienteMap[descricao] = ingrediente;
    }

    // Pizza table - pizzas with relations and all fields
    for (const pizzaData of pizzasData) {
      // Create pizza for each size to illustrate normalization
      const pizzaMedia = await Pizza.create({
        nome: pizzaData.nome,
        preco: pizzaData.preco,
        id_categoria: categoriaPizza.id,
        id_tamanho: tamanhoMedia.id,
        imageUrl: pizzaData.imagem,
        soldOut: pizzaData.soldOut,
        descricao: pizzaData.descricao,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Add ingredients association
      const ingredientesToAdd = pizzaData.ingredientes.map(
        (ing) => ingredienteMap[ing].id
      );
      await pizzaMedia.addIngredientes(ingredientesToAdd);

      // Create a large version for demonstration
      const pizzaGrande = await Pizza.create({
        nome: pizzaData.nome + " Grande",
        preco: pizzaData.preco * 1.5, // example bigger price
        id_categoria: categoriaPizza.id,
        id_tamanho: tamanhoGrande.id,
        imageUrl: pizzaData.imagem,
        soldOut: pizzaData.soldOut,
        descricao: pizzaData.descricao + " tamanho grande",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await pizzaGrande.addIngredientes(ingredientesToAdd);
    }

    console.log("✅ Seed pizza menu (normalized) completed!");
  } catch (err) {
    console.error("Erro no seed pizza normalized:", err);
  } finally {
    await sequelize.close();
  }
}

seedPizzaNormalized();
