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
  {
    nome: "Quatro Queijos",
    preco: 15.0,
    imagem:
      "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/pizzas/pizza-3.jpg",
    ingredientes: ["mozzarella", "gorgonzola", "parmesan", "emmental"],
    soldOut: false,
    descricao: "Combinação deliciosa de quatro tipos de queijo",
  },
  {
    nome: "Pepperoni",
    preco: 13.5,
    imagem:
      "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/pizzas/pizza-4.jpg",
    ingredientes: ["tomato", "mozzarella", "pepperoni"],
    soldOut: false,
    descricao: "A clássica pizza americana com fatias de pepperoni",
  },
  {
    nome: "Vegetariana",
    preco: 13.0,
    imagem:
      "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/pizzas/pizza-5.jpg",
    ingredientes: ["tomato", "mozzarella", "bell pepper", "onion", "olive"],
    soldOut: false,
    descricao: "Pizza leve com vegetais frescos e saborosos",
  },
  {
    nome: "Frango com Catupiry",
    preco: 14.5,
    imagem:
      "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/pizzas/pizza-6.jpg",
    ingredientes: ["mozzarella", "chicken", "catupiry"],
    soldOut: false,
    descricao: "Pizza brasileira com frango desfiado e catupiry cremoso",
  },
];

async function seedPizzaNormalized() {
  try {
    await sequelize.sync({ force: true });

    // Categorias
    const categoriaVegetariana = await Categoria.create({
      descricao: "Vegetariana",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const categoriaTradicional = await Categoria.create({
      descricao: "Tradicional",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Tamanhos
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

    // Ingredientes únicos
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

    // Inserir pizzas
    for (const pizzaData of pizzasData) {
      const isVeg = pizzaData.nome.toLowerCase().includes("vegetariana");
      const categoria = isVeg ? categoriaVegetariana : categoriaTradicional;

      // Média
      const pizzaMedia = await Pizza.create({
        nome: pizzaData.nome,
        preco: pizzaData.preco,
        id_categoria: categoria.id,
        id_tamanho: tamanhoMedia.id,
        imageUrl: pizzaData.imagem,
        soldOut: pizzaData.soldOut,
        descricao: pizzaData.descricao,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const ingredientesToAdd = pizzaData.ingredientes.map(
        (ing) => ingredienteMap[ing].id
      );
      await pizzaMedia.addIngredientes(ingredientesToAdd);

      // Grande
      const pizzaGrande = await Pizza.create({
        nome: pizzaData.nome + " Grande",
        preco: (pizzaData.preco * 1.5).toFixed(2),
        id_categoria: categoria.id,
        id_tamanho: tamanhoGrande.id,
        imageUrl: pizzaData.imagem,
        soldOut: pizzaData.soldOut,
        descricao: pizzaData.descricao + " em tamanho grande",
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
