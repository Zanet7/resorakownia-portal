import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Rozpoczynam odświeżanie bazy produktów...');

  // 1. Zabezpieczenie - usuwamy najpierw powiazania, bo produkty maja dzieci (CartItem, CollectionItem, Auction)
  await prisma.cartItem.deleteMany({});
  await prisma.collectionItem.deleteMany({});
  await prisma.bid.deleteMany({});
  await prisma.auction.deleteMany({});
  await prisma.orderItem.deleteMany({});
  
  // 2. Usuwamy wszystkie istniejące produkty
  await prisma.product.deleteMany({});
  console.log('✅ Stare produkty usunięte.');

  // 3. Pobieranie użytkownika (aby sprawdzić komu przypisać właścicielstwo)
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.error('Brak jakichkolwiek użytkowników w bazie!');
    return;
  }
  const admin = users.find(u => u.role === 'ADMIN') || users[0];

  // 4. Upewnienie się lub stworzenie słowników
  let brands = await prisma.brand.findMany();
  if (brands.length === 0) {
    await prisma.brand.createMany({ data: [{name: 'Hot Wheels'}, {name: 'Matchbox'}, {name: 'Bburago'}]});
    brands = await prisma.brand.findMany();
  }

  let cats = await prisma.category.findMany();
  if (cats.length === 0) {
    await prisma.category.createMany({ data: [{name: 'Pojazdy'}, {name: 'Motocykle'}, {name: 'Helikoptery'}]});
    cats = await prisma.category.findMany();
  }

  // 5. Dodawanie nowych, pełnowartościowych produktów z prawidłowymi atrybutami
  const newProducts = [
    {
      name: 'Hot Wheels Ford Mustang 68',
      scale: '1:64',
      year: 1968,
      description: 'Klasyk amerykańskiej motoryzacji w niesamowitym malowaniu.',
      imageUrl: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42a5?auto=format&fit=crop&q=80&w=600',
      price: 19.99,
      brandId: brands[0]?.id,
      categoryId: cats[0]?.id,
      ownerId: admin.id
    },
    {
      name: 'Matchbox Porsche 911 Turbo',
      scale: '1:64',
      year: 1989,
      description: 'Złota era europejskich supersamochodów w Twojej gablocie.',
      imageUrl: 'https://images.unsplash.com/photo-1503376713203-b097b6920fdf?auto=format&fit=crop&q=80&w=600',
      price: 24.50,
      brandId: brands[1] ? brands[1].id : brands[0]?.id,
      categoryId: cats[0]?.id,
      ownerId: admin.id
    },
    {
      name: 'Bburago Ferrari F40',
      scale: '1:43',
      year: 1987,
      description: 'Kultowy model z dbałością o każdy detal.',
      imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=600',
      price: 69.00,
      brandId: brands[2] ? brands[2].id : brands[0]?.id,
      categoryId: cats[0]?.id,
      ownerId: admin.id
    }
  ];

  for (const prod of newProducts) {
    if (prod.brandId && prod.categoryId) {
        await prisma.product.create({ data: prod });
    }
  }

  console.log('✅ Utworzono 3 nowe produkty połączone ze słownikami!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
