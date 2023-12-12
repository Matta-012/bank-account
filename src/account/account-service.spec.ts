// import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma.service';
import { AccountService } from './account.service';
import { Prisma } from '@prisma/client';

const accountMock = [
  {
    account_number: 1,
    branch_id: 3,
    account_type_id: 1,
    balance: 1200000.99,
    active: true,
    created_at: new Date('2023-12-12T22:29:49.390Z'),
    updated_at: null,
  },
  {
    account_number: 1,
    branch_id: 1,
    account_type_id: 2,
    balance: 1100000.99,
    active: true,
    created_at: new Date('2023-12-12T22:29:49.390Z'),
    updated_at: null,
  },
  {
    account_number: 3,
    branch_id: 2,
    account_type_id: 2,
    balance: 1000000.99,
    active: false,
    created_at: new Date('2023-12-12T22:29:49.390Z'),
    updated_at: null,
  },
];

const transactionMock = [
  {
    id: '5fdb5a66-18bc-4770-86b5-9aabdeb19223',
    transaction_type_id: 1,
    description: 'Funding round crunchbase',
    amount: 700000.99,
    created_at: '2023-12-12T19:18:30.569Z',
    account_number: 1,
  },
];

const prismaMock = {
  account: {
    create: jest.fn().mockReturnValue(accountMock[0]),
    update: jest.fn().mockReturnValue(accountMock[1]),
    findMany: jest.fn().mockReturnValue(accountMock),
    findFirst: jest.fn().mockReturnValue(accountMock[0]),
  },
  transaction: {
    create: jest.fn().mockReturnValue(transactionMock[0]),
  },
  $transaction: jest.fn().mockReturnValue([accountMock[1], transactionMock[0]]),
};

describe('AccountService', () => {
  let service: AccountService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it(`should return an array of Accounts`, async () => {
      const page = 1;
      const limit = 10;
      const response = await service.getAll(page, limit);

      expect(response).toStrictEqual(accountMock);
      expect(prisma.account.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.account.findMany).toHaveBeenCalledWith({
        skip: 1,
        take: 10,
      });
    });
  });

  describe('getById', () => {
    it(`should return an Account`, async () => {
      const response = await service.getById(accountMock[0].account_number);

      expect(response).toStrictEqual(accountMock[0]);
      expect(prisma.account.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.account.findFirst).toHaveBeenCalledWith({
        where: { account_number: 1 },
      });
    });
  });

  describe('getById', () => {
    it(`should return a single Account`, async () => {
      const response = await service.getById(accountMock[0].account_number);

      expect(response).toStrictEqual(accountMock[0]);
      expect(prisma.account.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.account.findFirst).toHaveBeenCalledWith({
        where: { account_number: 1 },
      });
    });

    it(`should return nothing when account is not found`, async () => {
      jest.spyOn(prisma.account, 'findFirst').mockResolvedValue(undefined);
      const response = await service.getById(999);

      expect(response).toBeUndefined();
      expect(prisma.account.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.account.findFirst).toHaveBeenCalledWith({
        where: { account_number: 999 },
      });
    });
  });

  describe('create', () => {
    it(`should create a new Account`, async () => {
      const response = await service.create(accountMock[0]);

      expect(response).toStrictEqual(accountMock[0]);
      expect(prisma.account.create).toHaveBeenCalledTimes(1);
      expect(prisma.account.create).toHaveBeenCalledWith({
        data: accountMock[0],
      });
    });
  });

  describe('update', () => {
    it(`should update an Account`, async () => {
      const responseData = {
        ...accountMock[1],
        account_type_id: 2,
        balance: new Prisma.Decimal(accountMock[1].balance),
        branch_id: 1,
        updated_at: new Date('2023-12-12T23:06:54.752Z'),
      };
      jest.spyOn(prisma.account, 'update').mockResolvedValue(responseData);
      jest.useFakeTimers().setSystemTime(new Date('2023-12-12T23:06:54.752Z'));

      const response = await service.update(accountMock[0].account_number, {
        account_type_id: 2,
        branch_id: 2,
      });

      expect(response).toStrictEqual(responseData);
      expect(prisma.account.update).toHaveBeenCalledTimes(1);
      expect(prisma.account.update).toHaveBeenCalledWith({
        where: { account_number: accountMock[0].account_number },
        data: {
          account_type_id: 2,
          branch_id: 2,
          updated_at: new Date('2023-12-12T23:06:54.752Z'),
        },
      });
    });
  });

  describe('inactivate', () => {
    it(`should update an Account status to inactive`, async () => {
      const responseData = {
        ...accountMock[1],
        account_type_id: 2,
        balance: new Prisma.Decimal(accountMock[1].balance),
        branch_id: 1,
        updated_at: new Date('2023-12-12T23:06:54.752Z'),
      };
      jest.useFakeTimers().setSystemTime(new Date('2023-12-12T23:06:54.752Z'));

      const response = await service.inactivate(accountMock[0].account_number);

      expect(response).toStrictEqual(responseData);
      expect(prisma.account.update).toHaveBeenCalledTimes(1);
      expect(prisma.account.update).toHaveBeenCalledWith({
        where: { account_number: accountMock[0].account_number },
        data: {
          active: false,
          updated_at: new Date('2023-12-12T23:06:54.752Z'),
        },
      });
    });
  });

  describe('activate', () => {
    it(`should update an Account status to active`, async () => {
      const responseData = {
        ...accountMock[1],
        account_type_id: 2,
        balance: new Prisma.Decimal(accountMock[1].balance),
        branch_id: 1,
        updated_at: new Date('2023-12-12T23:06:54.752Z'),
      };
      jest.useFakeTimers().setSystemTime(new Date('2023-12-12T23:06:54.752Z'));

      const response = await service.activate(accountMock[0].account_number);

      expect(response).toStrictEqual(responseData);
      expect(prisma.account.update).toHaveBeenCalledTimes(1);
      expect(prisma.account.update).toHaveBeenCalledWith({
        where: { account_number: accountMock[0].account_number },
        data: {
          active: true,
          updated_at: new Date('2023-12-12T23:06:54.752Z'),
        },
      });
    });
  });

  describe('deposit', () => {
    it(`should deposit an amount on an existing account`, async () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-12-12T23:06:54.752Z'));

      const response = await service.deposit(accountMock[0].account_number, {
        amount: 700000.99,
        description: 'Funding round crunchbase',
      });

      expect(response).toStrictEqual([accountMock[1], transactionMock[0]]);
      expect(prisma.account.update).toHaveBeenCalledTimes(1);
      expect(prisma.account.update).toHaveBeenCalledWith({
        where: { account_number: accountMock[0].account_number },
        data: {
          balance: { increment: 700000.99 },
          updated_at: new Date('2023-12-12T23:06:54.752Z'),
        },
      });
    });
  });

  describe('withdraw', () => {
    it(`should withdraw an amount on an existing account`, async () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-12-12T23:06:54.752Z'));

      const response = await service.withdraw(accountMock[0].account_number, {
        amount: 700000.99,
        description: 'Funding round crunchbase withdraw',
      });

      expect(response).toStrictEqual([accountMock[1], transactionMock[0]]);
    });
  });
});
