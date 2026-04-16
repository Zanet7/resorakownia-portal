const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function main() { 
  await prisma.brand.createMany({ 
    data: [
      {name: 'Hot Wheels'}, {name: 'Matchbox'}, {name: 'Bburago'}, {name: 'Majorette'}, {name: 'Siku'}, {name: 'Inna'}
    ], 
    skipDuplicates: true 
  }); 

  await prisma.category.createMany({ 
    data: [
      {name: 'Samochody osobowe'}, {name: 'Pojazdy ciezarowe / Autobusy'}, {name: 'Pojazdy specjalne'}, {name: 'Zestawy torow'}, {name: 'Akcesoria i dodatki'}, {name: 'Inne'}
    ], 
    skipDuplicates: true 
  }); 

  console.log('Seeded'); 
} 

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
