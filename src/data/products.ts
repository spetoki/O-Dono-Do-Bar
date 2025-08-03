
import type { Product } from '@/types';

export const products: Product[] = [
  // Bebidas
  {
    id: 1,
    name: 'Cerveja Brahma Duplo Malte 350ml',
    description: 'Lata de cerveja Brahma Duplo Malte, puro malte e refrescante.',
    price: 3.50,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Bebidas',
    stock: 24,
    dataAiHint: 'beer can'
  },
  {
    id: 2,
    name: 'Refrigerante Coca-Cola 2L',
    description: 'O clássico refrigerante de cola, tamanho família para compartilhar.',
    price: 9.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Bebidas',
    stock: 15,
    dataAiHint: 'soda bottle'
  },
  {
    id: 3,
    name: 'Vinho Tinto Casillero del Diablo 750ml',
    description: 'Vinho tinto chileno, seco e encorpado, ideal para carnes.',
    price: 55.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Bebidas',
    stock: 8,
    dataAiHint: 'wine bottle'
  },
  {
    id: 4,
    name: 'Água Mineral com Gás 500ml',
    description: 'Água mineral pura e borbulhante, uma opção saudável e refrescante.',
    price: 2.50,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Bebidas',
    stock: 50,
    dataAiHint: 'water bottle'
  },
  {
    id: 6,
    name: 'Suco de Laranja Natural 1L',
    description: 'Suco de laranja 100% natural, sem adição de açúcar.',
    price: 12.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Bebidas',
    stock: 3,
    dataAiHint: 'juice carton'
  },
  {
    id: 7,
    name: 'Energético Red Bull 250ml',
    description: 'Bebida energética para dar aquele impulso extra de energia e foco.',
    price: 8.50,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Bebidas',
    stock: 30,
    dataAiHint: 'energy drink'
  },
  {
    id: 17,
    name: 'Cerveja Heineken Long Neck 330ml',
    description: 'Cerveja premium de alta qualidade com sabor marcante.',
    price: 6.50,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Bebidas',
    stock: 40,
    dataAiHint: 'beer bottle'
  },
  {
    id: 18,
    name: 'Guaraná Antarctica 350ml',
    description: 'Lata do refrigerante com o sabor autêntico do guaraná.',
    price: 3.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Bebidas',
    stock: 18,
    dataAiHint: 'soda can'
  },
  {
    id: 19,
    name: 'Whisky Johnnie Walker Red Label 750ml',
    description: 'Blended Scotch Whisky, ideal para drinks e coquetéis.',
    price: 95.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Bebidas',
    stock: 5,
    dataAiHint: 'whisky bottle'
  },
  {
    id: 20,
    name: 'Vodka Smirnoff 998ml',
    description: 'Vodka tridestilada, perfeita para caipirinhas e outros drinks.',
    price: 40.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Bebidas',
    stock: 12,
    dataAiHint: 'vodka bottle'
  },

  // Tabacaria
  {
    id: 5,
    name: 'Tabaco para Enrolar Pueblo 30g',
    description: 'Tabaco de alta qualidade, de queima suave, para enrolar o seu próprio cigarro.',
    price: 28.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Tabacaria',
    stock: 2,
    dataAiHint: 'tobacco pouch'
  },
  {
    id: 8,
    name: 'Pod Descartável Nikbar 1500 Puffs',
    description: 'Cigarro eletrônico descartável com sabor de menta, prático e fácil de usar.',
    price: 60.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Tabacaria',
    stock: 10,
    dataAiHint: 'vape pen'
  },
  {
    id: 15,
    name: 'Seda Smoking Brown King Size',
    description: 'Livreto de seda de alta qualidade para enrolar. Queima lenta e uniforme.',
    price: 5.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Tabacaria',
    stock: 50,
    dataAiHint: 'rolling papers'
  },
  {
    id: 21,
    name: 'Cigarro Marlboro Red Box',
    description: 'Maço de cigarros Marlboro Vermelho, sabor tradicional e intenso.',
    price: 12.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Tabacaria',
    stock: 20,
    dataAiHint: 'cigarette pack'
  },
  {
    id: 22,
    name: 'Isqueiro BIC Grande',
    description: 'Isqueiro clássico, confiável e durável. Cor sortida.',
    price: 7.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Tabacaria',
    stock: 35,
    dataAiHint: 'bic lighter'
  },
  {
    id: 23,
    name: 'Filtro de Cigarro A-leda 6mm',
    description: 'Saco com filtros de acetato para cigarros de enrolar.',
    price: 4.50,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Tabacaria',
    stock: 1,
    dataAiHint: 'cigarette filters'
  },
  {
    id: 24,
    name: 'Charuto Cubano Montecristo',
    description: 'Charuto premium feito à mão, para apreciadores.',
    price: 85.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Tabacaria',
    stock: 4,
    dataAiHint: 'cigar'
  },
  {
    id: 25,
    name: 'Essência para Narguile Zomo 50g',
    description: 'Essência sabor Strong Mint para sessões de narguile.',
    price: 15.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Tabacaria',
    stock: 22,
    dataAiHint: 'shisha tobacco'
  },
  {
    id: 26,
    name: 'Piteira de Papel Bem Bolado',
    description: 'Bloco com piteiras de papel para cigarros de enrolar.',
    price: 2.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Tabacaria',
    stock: 40,
    dataAiHint: 'filter tips'
  },
  {
    id: 27,
    name: 'Cachimbo de Madeira',
    description: 'Cachimbo clássico de madeira para fumos variados.',
    price: 70.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Tabacaria',
    stock: 3,
    dataAiHint: 'smoking pipe'
  },
  
  // Salgadinhos
  {
    id: 9,
    name: 'Batata Ruffles Churrasco 76g',
    description: 'Batata chips crocante, sabor churrasco. A que vem com ar.',
    price: 8.50,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Salgadinhos',
    stock: 15,
    dataAiHint: 'chips bag'
  },
  {
    id: 13,
    name: 'Amendoim Japonês Elma Chips 150g',
    description: 'Amendoim torrado com uma casquinha crocante e salgada.',
    price: 6.50,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Salgadinhos',
    stock: 25,
    dataAiHint: 'peanuts'
  },
  {
    id: 28,
    name: 'Doritos Queijo Nacho 84g',
    description: 'O clássico salgadinho de milho com sabor intenso de queijo nacho.',
    price: 7.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Salgadinhos',
    stock: 13,
    dataAiHint: 'doritos bag'
  },
  {
    id: 29,
    name: 'Cheetos Requeijão 140g',
    description: 'Salgadinho de milho assado, sabor requeijão.',
    price: 9.50,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Salgadinhos',
    stock: 18,
    dataAiHint: 'cheetos bag'
  },
  {
    id: 30,
    name: 'Fandangos Presunto 140g',
    description: 'Salgadinho de milho em formato de concha com sabor presunto.',
    price: 9.50,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Salgadinhos',
    stock: 22,
    dataAiHint: 'snack bag'
  },
  {
    id: 31,
    name: 'Pringles Original 114g',
    description: 'Lata de batatas Pringles, sabor original e inconfundível.',
    price: 15.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Salgadinhos',
    stock: 9,
    dataAiHint: 'pringles can'
  },
  {
    id: 32,
    name: 'Torcida Pimenta Mexicana 70g',
    description: 'Salgadinho de trigo com o sabor picante da pimenta mexicana.',
    price: 3.50,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Salgadinhos',
    stock: 30,
    dataAiHint: 'snack bag'
  },
  {
    id: 33,
    name: 'Ovinho de Amendoim Dori 150g',
    description: 'Amendoim coberto com uma casca crocante, perfeito como aperitivo.',
    price: 5.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Salgadinhos',
    stock: 14,
    dataAiHint: 'coated peanuts'
  },
  {
    id: 34,
    name: 'Pistache Salgado 100g',
    description: 'Pistaches torrados e salgados, um snack sofisticado.',
    price: 18.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Salgadinhos',
    stock: 7,
    dataAiHint: 'pistachios'
  },
  {
    id: 35,
    name: 'Salgadinho de Bacon Baconzitos 95g',
    description: 'Salgadinho de trigo com intenso sabor de bacon.',
    price: 6.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Salgadinhos',
    stock: 3,
    dataAiHint: 'snack bag'
  },

  // Doces
  {
    id: 10,
    name: 'Chocolate Lacta ao Leite 90g',
    description: 'Barra de chocolate ao leite cremoso. Uma delícia que derrete na boca.',
    price: 6.50,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Doces',
    stock: 20,
    dataAiHint: 'chocolate bar'
  },
  {
    id: 14,
    name: 'Goma de Mascar Trident Menta',
    description: 'Goma de mascar sem açúcar sabor menta. Hálito fresco por mais tempo.',
    price: 2.50,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Doces',
    stock: 50,
    dataAiHint: 'gum package'
  },
  {
    id: 36,
    name: 'Bala Halls Morango',
    description: 'Bala extra forte com sabor refrescante de morango.',
    price: 2.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Doces',
    stock: 100,
    dataAiHint: 'candy pack'
  },
  {
    id: 37,
    name: 'Paçoca Paçoquita 22g',
    description: 'A tradicional paçoca de amendoim, doce na medida certa.',
    price: 1.50,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Doces',
    stock: 80,
    dataAiHint: 'peanut candy'
  },
  {
    id: 38,
    name: 'Chocolate Bis Xtra 45g',
    description: 'A combinação perfeita de wafer crocante e chocolate ao leite.',
    price: 3.50,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Doces',
    stock: 30,
    dataAiHint: 'chocolate wafer'
  },
  {
    id: 39,
    name: 'Doce de Leite 400g',
    description: 'Pote de doce de leite cremoso, perfeito para sobremesas.',
    price: 12.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Doces',
    stock: 10,
    dataAiHint: 'dulce de leche'
  },
  {
    id: 40,
    name: 'Bala Fini Tubes Cítricos',
    description: 'Rolinhos de gelatina com recheio cítrico e cobertura de açúcar.',
    price: 7.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Doces',
    stock: 25,
    dataAiHint: 'gummy candy'
  },
  {
    id: 41,
    name: 'Barra de Cereal Nutry 22g',
    description: 'Barra de cereal com castanhas e chocolate, opção saudável.',
    price: 3.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Doces',
    stock: 40,
    dataAiHint: 'cereal bar'
  },
  {
    id: 42,
    name: 'Pirulito Big Big Morango',
    description: 'Pirulito recheado com chiclete sabor morango.',
    price: 1.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Doces',
    stock: 150,
    dataAiHint: 'lollipop'
  },
  {
    id: 43,
    name: 'Sorvete Kibon Chicabon 52g',
    description: 'Picolé cremoso de chocolate com malte.',
    price: 5.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Doces',
    stock: 2,
    dataAiHint: 'ice cream'
  },

  // Diversos
  {
    id: 11,
    name: 'Copo Descartável 200ml (100 un)',
    description: 'Pacote com 100 copos descartáveis para festas e eventos.',
    price: 8.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Diversos',
    stock: 10,
    dataAiHint: 'plastic cups'
  },
  {
    id: 44,
    name: 'Guardanapo de Papel (50 un)',
    description: 'Pacote com guardanapos de papel de folha simples.',
    price: 4.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Diversos',
    stock: 15,
    dataAiHint: 'napkins'
  },
  {
    id: 45,
    name: 'Vela de Aniversário',
    description: 'Vela de aniversário com números de 0 a 9.',
    price: 3.50,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Diversos',
    stock: 20,
    dataAiHint: 'birthday candle'
  },
  {
    id: 46,
    name: 'Baralho Copag 139',
    description: 'Baralho tradicional para jogos de cartas como truco e buraco.',
    price: 15.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Diversos',
    stock: 5,
    dataAiHint: 'playing cards'
  },
  {
    id: 47,
    name: 'Carregador de Celular Tipo C',
    description: 'Carregador de parede com cabo USB-C, carregamento rápido.',
    price: 45.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Diversos',
    stock: 8,
    dataAiHint: 'phone charger'
  },
  {
    id: 48,
    name: 'Pilha Alcalina AA (4 un)',
    description: 'Pacote com 4 pilhas alcalinas tipo AA de longa duração.',
    price: 18.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Diversos',
    stock: 12,
    dataAiHint: 'batteries'
  },
  {
    id: 49,
    name: 'Saco de Lixo 50L (10 un)',
    description: 'Rolo com 10 sacos de lixo reforçados de 50 litros.',
    price: 10.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Diversos',
    stock: 18,
    dataAiHint: 'trash bag'
  },
  {
    id: 50,
    name: 'Cola Super Bonder',
    description: 'Cola instantânea de alta resistência para pequenos reparos.',
    price: 9.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Diversos',
    stock: 6,
    dataAiHint: 'super glue'
  },
  {
    id: 51,
    name: 'Absorvente (8 un)',
    description: 'Pacote de absorventes higiênicos com abas.',
    price: 7.50,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Diversos',
    stock: 2,
    dataAiHint: 'sanitary pad'
  },
  {
    id: 52,
    name: 'Preservativo (3 un)',
    description: 'Caixa com 3 unidades de preservativo de látex.',
    price: 6.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Diversos',
    stock: 30,
    dataAiHint: 'condom pack'
  },

  // Outros
  {
    id: 12,
    name: 'Gelo de Coco 2kg',
    description: 'Saco de gelo de água de coco. Ideal para drinks e manter bebidas geladas.',
    price: 10.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Outros',
    stock: 8,
    dataAiHint: 'ice bag'
  },
  {
    id: 16,
    name: 'Carvão para Churrasco 3kg',
    description: 'Saco de carvão vegetal de eucalipto para churrasco.',
    price: 18.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Outros',
    stock: 12,
    dataAiHint: 'charcoal bag'
  },
  {
    id: 53,
    name: 'Gelo Filtrado 5kg',
    description: 'Saco de gelo em cubos feito com água filtrada.',
    price: 15.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Outros',
    stock: 20,
    dataAiHint: 'ice bag'
  },
  {
    id: 54,
    name: 'Pão de Alho',
    description: 'Pacote de pão de alho para churrasco.',
    price: 12.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Outros',
    stock: 15,
    dataAiHint: 'garlic bread'
  },
  {
    id: 55,
    name: 'Azeite de Oliva Extra Virgem 500ml',
    description: 'Azeite para temperar saladas e finalizar pratos.',
    price: 25.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Outros',
    stock: 9,
    dataAiHint: 'olive oil'
  },
  {
    id: 56,
    name: 'Sal Grosso para Churrasco 1kg',
    description: 'Pacote de sal grosso, ideal para temperar carnes.',
    price: 5.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Outros',
    stock: 25,
    dataAiHint: 'salt bag'
  },
  {
    id: 57,
    name: 'Fósforo (Caixa c/ 10)',
    description: 'Caixa com 10 caixinhas de fósforos.',
    price: 4.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Outros',
    stock: 30,
    dataAiHint: 'matchbox'
  },
  {
    id: 58,
    name: 'Cápsula de Café (10 un)',
    description: 'Caixa com 10 cápsulas de café compatíveis com Nespresso.',
    price: 22.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Outros',
    stock: 11,
    dataAiHint: 'coffee capsules'
  },
  {
    id: 59,
    name: 'Adoçante Líquido 100ml',
    description: 'Adoçante dietético líquido para bebidas.',
    price: 8.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Outros',
    stock: 7,
    dataAiHint: 'sweetener bottle'
  },
  {
    id: 60,
    name: 'Ração para Cães 1kg',
    description: 'Pacote de 1kg de ração para cães adultos.',
    price: 20.00,
    imageUrl: 'https://placehold.co/200x200',
    category: 'Outros',
    stock: 5,
    dataAiHint: 'dog food'
  }
];
