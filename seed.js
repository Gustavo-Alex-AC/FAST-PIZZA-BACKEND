const {
  sequelize,
  Pizza,
  Usuario,
  TipoPagamento,
  Pedido,
  Pagamento,
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
  },
  {
    nome: "Capricciosa",
    preco: 14.0,
    imagem:
      "https://dclaevazetcjjkrzczpc.supabase.co/storage/v1/object/public/pizzas/pizza-2.jpg",
    ingredientes: ["tomato", "mozzarella", "ham", "mushrooms", "artichoke"],
    soldOut: true,
  },
  // Você pode adicionar mais pizzas aqui seguindo o mesmo formato
];

async function seed() {
  try {
    await sequelize.sync({ force: true }); // limpa e cria tudo do zero

    // Criar categoria Pizza - ATENÇÃO: campo é descricao, não nome
    const categoriaPizza = await Categoria.create({
      nome: "Pizza",
      descricao: "Categoria principal para pizzas",
    });

    // Criar tamanhos
    const tamanhoMedia = await Tamanho.create({ descricao: "Média" });
    const tamanhoGrande = await Tamanho.create({ descricao: "Grande" });

    // Criar todos os ingredientes únicos
    const allIngredients = new Set();
    pizzasData.forEach((p) => {
      p.ingredientes.forEach((ing) => allIngredients.add(ing));
    });

    const ingredienteMap = {};
    for (const descricaoIngrediente of allIngredients) {
      const ingrediente = await Ingrediente.create({
        descricao: descricaoIngrediente,
      });
      ingredienteMap[descricaoIngrediente] = ingrediente;
    }

    // Criar pizzas e associar ingredientes
    for (const p of pizzasData) {
      const pizza = await Pizza.create({
        nome: p.nome,
        preco: p.preco,
        id_categoria: categoriaPizza.id,
        id_tamanho: tamanhoMedia.id,
        imagem: p.imagem, // Use "imagem" porque seus dados usam essa chave
        soldOut: p.soldOut,
      });

      // associar ingredientes
      const ingredientesToAdd = p.ingredientes.map(
        (ingName) => ingredienteMap[ingName].id
      );
      await pizza.addIngredientes(ingredientesToAdd);
    }

    // Criar usuários
    const user1 = await Usuario.create({
      nome: "João",
      email: "joao@email.com",
    });
    const user2 = await Usuario.create({
      nome: "Maria",
      email: "maria@email.com",
    });

    // Criar tipos de pagamento
    const tp1 = await TipoPagamento.create({ descricao: "Dinheiro" });
    const tp2 = await TipoPagamento.create({ descricao: "Bai Paga" });

    // Criar um pedido de exemplo
    const pedido = await Pedido.create({
      usuarioId: user1.id,
      status: "pendente",
    });

    // Buscar pizzas para adicionar no pedido (limite 2)
    const pizzas = await Pizza.findAll({ limit: 2 });
    await pedido.addProdutos(pizzas);

    // Criar pagamento para o pedido
    await Pagamento.create({
      pedidoId: pedido.id,
      tipoPagamentoId: tp2.id,
      valor: pizzas.reduce((sum, p) => sum + Number(p.preco), 0),
      status: "confirmado",
    });

    console.log("✅ Dados inseridos com sucesso!");
  } catch (error) {
    console.error("Erro ao inserir dados:", error);
  } finally {
    await sequelize.close();
  }
}

seed();
