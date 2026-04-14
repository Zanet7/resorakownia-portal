const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Rozpoczynamy seedowanie...");

  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  if (!adminUser) {
    console.error("Nie znaleziono administratora. Utworz konto lub przypisz role ADMIN.");
    process.exit(1);
  }

  console.log(`Znaleziono admina: ${adminUser.email}`);

  const testProducts = [
    {
      name: "Porsche 911 GT3 RS",
      brand: "Hot Wheels Premium",
      scale: "1:64",
      description: "Ekskluzywny model Porsche 911 GT3 RS z serii Car Culture. Posiada gumowe opony i metalowe podwozie. Idealny stan.",
      price: 69.99,
      imageUrl: "https://images.unsplash.com/photo-1503376713356-238d2f0eb1a7?auto=format&fit=crop&q=80&w=800",
      ownerId: adminUser.id
    },
    {
      name: "Dodge Charger R/T 1970",
      brand: "Matchbox Collectors",
      scale: "1:64",
      description: "Klasyczny muscle car znany z kultowego filmu. Szczegółowe odwzorowanie z otwieraną maską i detalami silnika.",
      price: 54.99,
      imageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800",
      ownerId: adminUser.id
    },
    {
      name: "Nissan Skyline GT-R R34",
      brand: "Tomica Limited Vintage",
      scale: "1:64",
      description: "Wyjątkowy poziom detali. Zawieszenie na sprężynach, precyzyjne malowanie. Wysoce poszukiwany model wśród kolekcjonerów.",
      price: 149.99,
      imageUrl: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&q=80&w=800",
      ownerId: adminUser.id
    },
    {
      name: "Ferrari F40",
      brand: "Bburago",
      scale: "1:43",
      description: "Większa skala pozwalająca na lepsze odwzorowanie wnętrza i komory silnika. Kultowy model z lat 80.",
      price: 89.00,
      imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800",
      ownerId: adminUser.id
    },
    {
      name: "Lamborghini Aventador",
      brand: "Maisto",
      scale: "1:24",
      description: "Duży, imponujący model supersamochodu. Otwierane drzwi typu 'nożyce', szczegółowe wnętrze i komora silnika.",
      price: 129.99,
      imageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800",
      ownerId: adminUser.id
    }
  ];

  for (const product of testProducts) {
    const created = await prisma.product.create({
      data: product
    });
    console.log(`Dodano: ${created.name}`);
  }

  console.log("Dodawanie produktów zakończone pomyślnie.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
