export interface MenuEntry {
  name: string;
  ingredients?: string;
  price: number;
}

export interface MenuCategory {
  id: string;
  title: string;
  note: string;
  orderable: boolean;
  items: MenuEntry[];
}

export const menu: MenuCategory[] = [
  {
    id: 'classicos',
    title: 'Clássicos',
    note: 'Com hambúrguer de 56g.',
    orderable: true,
    items: [
      { name: 'X-Burguer', ingredients: 'Pão, hambúrguer 56g, queijo, presunto, alface, tomate, milho, batata palha', price: 17 },
      { name: 'X-Egg', ingredients: 'Pão, hambúrguer 56g, ovo, queijo, alface, tomate, milho, batata palha', price: 17 },
      { name: 'X-Bacon', ingredients: 'Pão, hambúrguer 56g, queijo, bacon, alface, tomate, milho, batata palha', price: 18 },
      { name: 'X-Lucheddar', ingredients: 'Pão, hambúrguer 56g, queijo, bacon, cheddar, alface, tomate, milho, batata palha', price: 19 },
      { name: 'X-Egg Bacon', ingredients: 'Pão, hambúrguer 56g, queijo, bacon, ovo, alface, tomate, milho, batata palha', price: 19 },
      { name: 'X-Lulu', ingredients: 'Pão, 2 hambúrgueres 56g, frango desfiado, catupiry, queijo, presunto, alface, tomate, milho, batata palha', price: 20 },
      { name: 'X-Tilulu', ingredients: 'Pão, hambúrguer 56g, frango desfiado, queijo, catupiry, bacon, alface, tomate, milho e batata palha', price: 22 },
      { name: 'Laçador', ingredients: 'Pão, hambúrguer 56g, frango desfiado, catupiry, queijo, presunto, bacon, ovo, alface, tomate, milho, batata palha', price: 22 },
      { name: 'X-Americano', ingredients: 'Pão, hambúrguer 56g, queijo, presunto, bacon, ovo, cheddar, alface, tomate, milho, batata palha', price: 22 },
      { name: 'X-Galinha', ingredients: 'Pão, frango desfiado, catupiry, queijo, presunto, bacon, ovo, alface, tomate, milho, batata palha', price: 23 },
      { name: 'Americano Especial', ingredients: 'Pão, 2 hambúrgueres 56g, frango desfiado, catupiry, queijo, presunto, bacon, alface, tomate, milho, batata palha', price: 24 },
      { name: 'X-Tudo', ingredients: 'Pão, hambúrguer 56g, frango desfiado, queijo, presunto, bacon em cubos, ovo, milho, batata palha, alface, tomate, catupiry, cheddar e abacaxi caramelizado', price: 25 },
      { name: 'Tilu Especial', ingredients: 'Pão, 3 hambúrgueres 56g, frango desfiado, queijo, presunto, bacon em cubos, ovo, milho, batata palha, alface, tomate, catupiry, cheddar', price: 26 },
    ],
  },
  {
    id: 'picanha',
    title: 'Picanha',
    note: 'Com hambúrguer de picanha de 120g.',
    orderable: true,
    items: [
      { name: 'X-Bacon Picanha', ingredients: 'Pão, hambúrguer de picanha 120g, bacon, queijo, alface, tomate, milho, batata palha', price: 23 },
      { name: 'X-Egg Bacon Picanha', ingredients: 'Pão, hambúrguer de picanha 120g, ovo, bacon, queijo, alface, tomate, milho, batata palha', price: 24 },
      { name: 'X-Egg Bacon Especial', ingredients: 'Pão, hambúrguer de picanha 120g, ovo, bacon, queijo, catupiry, alface, tomate, milho, batata palha', price: 26 },
      { name: 'X-Tudo Picanha', ingredients: 'Pão, hambúrguer de picanha 120g, frango desfiado, queijo, presunto, bacon em cubos, ovo, milho, batata palha, alface, tomate, catupiry, cheddar e abacaxi caramelizado', price: 28 },
    ],
  },
  {
    id: 'acrescimos',
    title: 'Acréscimos',
    note: 'Peça junto com o seu lanche.',
    orderable: false,
    items: [
      { name: 'Molho verde', price: 2 },
      { name: 'Baconese', price: 3 },
      { name: 'Hambúrguer 56g', price: 3 },
      { name: 'Hambúrguer de picanha 120g', price: 7 },
      { name: 'Presunto', price: 2 },
      { name: 'Queijo', price: 2 },
      { name: 'Abacaxi', price: 2 },
      { name: 'Ovo', price: 2.5 },
      { name: 'Cheddar', price: 2.5 },
      { name: 'Bacon', price: 3 },
      { name: 'Frango desfiado', price: 3 },
      { name: 'Catupiry', price: 4 },
    ],
  },
  {
    id: 'bebidas',
    title: 'Bebidas',
    note: 'Peça junto com o seu lanche.',
    orderable: false,
    items: [
      { name: 'Coca-Cola lata 310 ml, tradicional', price: 6 },
      { name: 'Coca-Cola lata 310 ml, zero', price: 6 },
      { name: 'Mate Couro 1 litro, tradicional', price: 8 },
    ],
  },
];
