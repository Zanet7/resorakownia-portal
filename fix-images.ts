import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateImages() {
  const images = [
    'https://loremflickr.com/600/400/mustang,car',
    'https://loremflickr.com/600/400/porsche,car,toy',
    'https://loremflickr.com/600/400/ferrari,car,toy'
  ];

  const products = await prisma.product.findMany();
  
  for (let i = 0; i < products.length; i++) {
    const defaultImg = images[i % images.length];
    await prisma.product.update({
      where: { id: products[i].id },
      data: { imageUrl: defaultImg }
    });
  }
}

updateImages()
  .then(() => {
    console.log("Zaktualizowano zdjęcia poprawnie.");
  })
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
