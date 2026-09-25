export interface Review {
  author: string;
  text: string;
  ownerReply?: string;
}

export interface Business {
  name: string;
  tagline: string;
  whatsapp: string;
  instagram: string;
  instagramHandle: string;
  address: { street: string; district: string; city: string; state: string; zip: string };
  timeZone: string;
  hours: { opensAt: number; closesAt: number };
  hoursLabel: string;
  serviceLabel: string;
  rating: { value: number; count: number; source: string };
  credit: { label: string; url: string };
  copy: {
    heroTitle: string;
    heroLede: string;
    orderCta: string;
    menuTitle: string;
    reviewsTitle: string;
    locationTitle: string;
  };
  reviews: Review[];
}

export const business: Business = {
  name: "Tiluburguer's",
  tagline: 'O Hambúrguer Raiz',
  whatsapp: '5531984811004',
  instagram: 'https://www.instagram.com/tiluburguers',
  instagramHandle: '@tiluburguers',
  address: {
    street: 'Rua Cananéia, 97',
    district: 'Caiçara',
    city: 'Belo Horizonte',
    state: 'MG',
    zip: '30770-120',
  },
  timeZone: 'America/Sao_Paulo',
  hours: { opensAt: 19, closesAt: 24 },
  hoursLabel: 'Todos os dias, das 19h à 0h',
  serviceLabel: 'Delivery e retirada no Caiçara, sem consumo no local.',
  rating: { value: 4.5, count: 42, source: 'Google' },
  credit: { label: 'Feito com fome por JH Online Solutions', url: 'https://jhonlinesolutions.com.br' },
  copy: {
    heroTitle: 'O hambúrguer raiz do Caiçara.',
    heroLede: 'Feito na chapa, bem recheado. Delivery e retirada todos os dias, das 19h à meia-noite.',
    orderCta: 'Pedir no WhatsApp',
    menuTitle: 'Cardápio',
    reviewsTitle: 'Quem pede, volta.',
    locationTitle: 'Onde estamos',
  },
  reviews: [
    {
      author: 'Isabela',
      text: 'Melhor hambúrguer de BH, o hambúrguer mais recheado que já comi aqui, vale demais!',
      ownerReply: 'Obrigado Isabela',
    },
    {
      author: 'Gabrielle L.',
      text: 'Tinha muito tempo que não comia um sanduíche raiz tão saboroso. Fomos achando que era um lugar para comer no local, mas o estabelecimento é para retirada. Aliás, não posso deixar de comentar que o cheiro na porta estava uma delícia, um dos…',
    },
    {
      author: 'Eder J.',
      text: 'Sempre peço lá, atendimento ótimo e o hambúrguer é delicioso. Só insumo de qualidade. Podem pedir sem medo, se tiver alguém reclamando é porque comeu errado. Nota 10',
    },
    {
      author: 'Fernando T.',
      text: 'Hambúrguer simplesmente delicioso! Quase passei direto, pois não sabia que era só delivery e uma moça muito atenciosa saiu da casa e fiz o pedido com ela. Eu estava com um pouco de pressa e eles providenciaram com agilidade meu lanche.',
    },
    { author: 'Rosimar O.', text: 'Melhor hambúrguer que já comi em minha vida.' },
    { author: 'Derly D.', text: 'Adorei o sanduíche, muito bem feito e muito gostoso. Parabéns' },
  ],
};
