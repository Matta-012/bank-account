import { Account, Transaction } from '@prisma/client';
import { DepositWithdrawAccountDto } from './dto/deposit-withdraw-account.dto';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

export interface IAccount {
  getAll(page: number, limit: number): Promise<Account[]>;
  getById(accountNumber: number): Promise<Account>;
  create(accountData: CreateAccountDto): Promise<Account>;
  update(
    accountNumber: number,
    accountData: UpdateAccountDto,
  ): Promise<Account>;
  inactivate(accountNumber: number): Promise<Account>;
  activate(accountNumber: number): Promise<Account>;
  deposit(
    accountNumber: number,
    depositWithdrawAccountDto: DepositWithdrawAccountDto,
  ): Promise<[Account, Transaction]>;
  withdraw(
    accountNumber: number,
    depositWithdrawAccountDto: DepositWithdrawAccountDto,
  ): Promise<Transaction>;
}
