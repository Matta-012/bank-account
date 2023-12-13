import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';

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
    account_number: 2,
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
  {
    account_number: 1,
    branch_id: 2,
    account_type_id: 2,
    balance: 1200000.99,
    active: true,
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

const serviceMock = {
  getAll: jest.fn().mockReturnValue(accountMock),
  getById: jest.fn().mockReturnValue(accountMock[1]),
  create: jest.fn().mockReturnValue(accountMock[0]),
  update: jest.fn().mockReturnValue(accountMock[3]),
  inactivate: jest.fn().mockReturnValue(accountMock[2]),
  activate: jest.fn().mockReturnValue(accountMock[0]),
  deposit: jest.fn().mockReturnValue([accountMock[0], transactionMock[0]]),
  withdraw: jest.fn().mockReturnValue(transactionMock[0]),
};

describe('AccountController', () => {
  let controller: AccountController;
  let service: AccountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
      providers: [{ provide: AccountService, useValue: serviceMock }],
    }).compile();

    controller = module.get<AccountController>(AccountController);
    service = module.get<AccountService>(AccountService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it(`should return an array of Accounts`, async () => {
      const response = await controller.getAll();

      expect(service.getAll).toHaveBeenCalled();
      expect(response).toEqual(accountMock);
    });
  });

  describe('getById', () => {
    it(`should return an Account`, async () => {
      const response = await controller.getById(
        accountMock[0].account_number.toString(),
      );

      expect(service.getById).toHaveBeenCalled();
      expect(response).toEqual(accountMock[1]);
    });
  });

  describe('create', () => {
    it(`should create a new Account`, async () => {
      const response = await controller.create(accountMock[0]);

      expect(service.create).toHaveBeenCalled();
      expect(response).toEqual(accountMock[0]);
    });
  });

  describe('update', () => {
    it(`should update an Account`, async () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-12-12T23:06:54.752Z'));

      const response = await controller.update(
        accountMock[0].account_number.toString(),
        {
          account_type_id: 2,
          branch_id: 2,
        },
      );

      expect(service.update).toHaveBeenCalled();
      expect(response).toEqual(accountMock[3]);
    });
  });

  describe('inactivate', () => {
    it(`should update an Account status to inactive`, async () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-12-12T23:06:54.752Z'));

      const response = await controller.inactivate(
        accountMock[2].account_number.toString(),
      );

      expect(service.inactivate).toHaveBeenCalled();
      expect(response).toEqual(accountMock[2]);
    });
  });

  describe('activate', () => {
    it(`should update an Account status to active`, async () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-12-12T23:06:54.752Z'));

      const response = await controller.activate(
        accountMock[0].account_number.toString(),
      );

      expect(service.activate).toHaveBeenCalled();
      expect(response).toEqual(accountMock[0]);
    });
  });

  describe('deposit', () => {
    it(`should deposit an amount on an existing account`, async () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-12-12T23:06:54.752Z'));

      const response = await controller.deposit(
        accountMock[0].account_number.toString(),
        {
          amount: 700000.99,
          description: 'Funding round crunchbase',
        },
      );

      expect(service.deposit).toHaveBeenCalled();
      expect(response).toEqual(transactionMock[0]);
    });
  });

  describe('withdraw', () => {
    it(`should withdraw an amount on an existing account`, async () => {
      jest.useFakeTimers().setSystemTime(new Date('2023-12-12T23:06:54.752Z'));

      const response = await controller.withdraw(
        accountMock[0].account_number.toString(),
        {
          amount: 700000.99,
          description: 'Funding round crunchbase',
        },
      );

      expect(service.withdraw).toHaveBeenCalled();
      expect(response).toEqual(transactionMock[0]);
    });
  });
});
