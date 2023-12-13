import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

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

const serviceMock = {
  getAll: jest.fn().mockReturnValue(transactionMock),
  getById: jest.fn().mockReturnValue(transactionMock[0]),
  getByAccountNumber: jest.fn().mockReturnValue(transactionMock),
};

describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [{ provide: TransactionService, useValue: serviceMock }],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it(`should return an array of transactions`, async () => {
      const response = await controller.getAll();

      expect(service.getAll).toHaveBeenCalled();
      expect(response).toEqual(transactionMock);
    });
  });

  describe('getAll by account number', () => {
    it(`should return an array of transactions from the account number`, async () => {
      const response = await controller.getByAccountNumber(
        transactionMock[0].account_number.toString(),
      );

      expect(service.getByAccountNumber).toHaveBeenCalled();
      expect(response).toEqual(transactionMock);
    });
  });

  describe('getById', () => {
    it(`should return a single transaction`, async () => {
      const response = await controller.getById(transactionMock[0].id);

      expect(service.getById).toHaveBeenCalled();
      expect(response).toEqual(transactionMock[0]);
    });
  });
});
