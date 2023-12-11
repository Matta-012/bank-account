import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedAccountType = async () => {
  const accType = await prisma.accountType.createMany({
    data: [
      {
        type: 'checking',
      },
      {
        type: 'savings',
      },
    ],
  });

  console.log(`Account types created: ${accType.count}`);
};

const seedTransactionType = async () => {
  const transactionType = await prisma.transactionType.createMany({
    data: [
      {
        type: 'deposit',
      },
      {
        type: 'withdrawal',
      },
    ],
  });

  console.log(`Transaction types created: ${transactionType.count}`);
};

const seedBranch = async () => {
  const branch = await prisma.branch.createMany({
    data: [
      {
        name: 'Banco BV',
      },
      {
        name: 'Itau',
      },
      {
        name: 'Nubank',
      },
    ],
  });

  console.log(`Branches created: ${branch.count}`);
};

const seedAccount = async () => {
  const branchId = await prisma.branch.findFirst({
    where: { name: 'Nubank' },
  });

  const accType = await prisma.accountType.findFirst({
    where: { type: 'checking' },
  });

  const account = await prisma.account.create({
    data: {
      branch_id: branchId.id,
      account_type_id: accType.id,
      balance: new Prisma.Decimal(1200000.99),
    },
  });

  console.log(`Account Number created: ${account.account_number}`);
};

const seedTransactions = async () => {
  const account = await prisma.account.findFirst({});

  const transactionType = await prisma.transactionType.findFirst({
    where: { type: 'deposit' },
  });

  const transactions = await prisma.transaction.createMany({
    data: [
      {
        account_number: account.account_number,
        description: 'Funding round crunchbase',
        amount: new Prisma.Decimal(500000.99),
        transaction_type_id: transactionType.id,
      },
      {
        account_number: account.account_number,
        description: 'Funding round crunchbase',
        amount: new Prisma.Decimal(700000.0),
        transaction_type_id: transactionType.id,
      },
    ],
  });

  console.log(`Transactions created: ${transactions.count}`);
};

async function main() {
  console.log('Seeding database...');

  console.time('seeded');

  await seedAccountType();
  await seedTransactionType();
  await seedBranch();
  await seedAccount();
  await seedTransactions();

  console.timeEnd('seeded');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
