import { Transaction } from '@prisma/client';

export interface ITransaction {
  getAll(page: number, limit: number): Promise<Transaction[]>;
  getById(id: string): Promise<Transaction>;
  getByAccountNumber(accountNumber: number): Promise<Transaction[]>;
}
