import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { TransactionService } from './transaction.service';

const transactionMock = [
  {
    id: '5fdb5a66-18bc-4770-86b5-9aabdeb19223',
    transaction_type_id: 1,
    description: 'Funding round crunchbase',
    amount: '500000.99',
    created_at: '2023-12-12T22:29:49.396Z',
    account_number: 1,
  },
  {
    id: 'f288eff4-7f64-4734-9ad9-4b3d8b950abf',
    transaction_type_id: 1,
    description: 'Funding round crunchbase',
    amount: '700000',
    created_at: '2023-12-12T22:29:49.396Z',
    account_number: 1,
  },
];

const prismaMock = {
  transaction: {
    findMany: jest.fn().mockReturnValue(transactionMock),
    findFirst: jest.fn().mockReturnValue(transactionMock[0]),
  },
};

describe('TransactionService', () => {
  let service: TransactionService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it(`should return an array of transactions`, async () => {
      const page = 1;
      const limit = 10;
      const response = await service.getAll(page, limit);

      expect(response).toStrictEqual(transactionMock);
      expect(prisma.transaction.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        skip: 1,
        take: 10,
      });
    });
  });

  describe('getAll by account number', () => {
    it(`should return an array of transactions from the account number`, async () => {
      const response = await service.getByAccountNumber(
        transactionMock[0].account_number,
      );

      expect(response).toStrictEqual(transactionMock);
      expect(prisma.transaction.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { account_number: transactionMock[0].account_number },
      });
    });
  });

  describe('getById', () => {
    it(`should return a single transaction`, async () => {
      const response = await service.getById(transactionMock[0].id);

      expect(response).toStrictEqual(transactionMock[0]);
      expect(prisma.transaction.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
        where: { id: transactionMock[0].id },
      });
    });

    it(`should return nothing when transaction is not found`, async () => {
      jest.spyOn(prisma.transaction, 'findFirst').mockResolvedValue(undefined);
      const response = await service.getById('xyz');

      expect(response).toBeUndefined();
      expect(prisma.transaction.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.transaction.findFirst).toHaveBeenCalledWith({
        where: { id: 'xyz' },
      });
    });
  });
});
