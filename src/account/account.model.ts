import { Account } from '@prisma/client';

export interface IAccount {
  getAll(page: number, limit: number): Promise<Account[]>;
  getById(accountNumber: number): Promise<Account>;
}
