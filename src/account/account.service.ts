import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Account, Transaction } from '@prisma/client';
import { IAccount } from './account.model';
import { PrismaService } from 'src/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DepositWithdrawAccountDto } from './dto/deposit-withdraw-account.dto';

@Injectable()
export class AccountService implements IAccount {
  constructor(private prisma: PrismaService) {}

  async getAll(page: number, limit: number): Promise<Account[]> {
    return this.prisma.account.findMany({
      skip: page,
      take: limit,
    });
  }

  async getById(accountNumber: number): Promise<Account> {
    return this.prisma.account.findFirst({
      where: { account_number: accountNumber },
    });
  }

  async create(accountData: CreateAccountDto): Promise<Account> {
    return this.prisma.account.create({
      data: accountData,
    });
  }

  async update(
    accountNumber: number,
    accountData: UpdateAccountDto,
  ): Promise<Account> {
    return this.prisma.account.update({
      where: { account_number: accountNumber },
      data: {
        account_type_id: accountData.account_type_id,
        branch_id: accountData.branch_id,
        updated_at: new Date(),
      },
    });
  }

  async inactivate(accountNumber: number): Promise<Account> {
    return this.prisma.account.update({
      where: { account_number: accountNumber },
      data: {
        active: false,
        updated_at: new Date(),
      },
    });
  }

  async activate(accountNumber: number): Promise<Account> {
    return this.prisma.account.update({
      where: { account_number: accountNumber },
      data: {
        active: true,
        updated_at: new Date(),
      },
    });
  }

  async deposit(
    accountNumber: number,
    depositWithdrawAccountDto: DepositWithdrawAccountDto,
  ): Promise<[Account, Transaction]> {
    const [account, transaction] = await this.prisma.$transaction([
      this.prisma.account.update({
        where: { account_number: accountNumber },
        data: {
          balance: { increment: depositWithdrawAccountDto.amount },
          updated_at: new Date(),
        },
      }),
      this.prisma.transaction.create({
        data: {
          account: { connect: { account_number: accountNumber } },
          transaction_type: { connect: { id: 1 } },
          amount: depositWithdrawAccountDto.amount,
          description: depositWithdrawAccountDto.description || null,
        },
      }),
    ]);

    return [account, transaction];
  }

  async withdraw(
    accountNumber: number,
    depositWithdrawAccountDto: DepositWithdrawAccountDto,
  ): Promise<Transaction> {
    const transaction = await this.prisma.$transaction(async (prisma) => {
      const account = await prisma.account.update({
        where: { account_number: accountNumber },
        data: {
          balance: { decrement: depositWithdrawAccountDto.amount },
          updated_at: new Date(),
        },
      });

      if (Number(account.balance) < 0) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Insufficient funds',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const transaction = await prisma.transaction.create({
        data: {
          account: { connect: { account_number: accountNumber } },
          transaction_type: { connect: { id: 2 } },
          amount: depositWithdrawAccountDto.amount,
          description: depositWithdrawAccountDto.description || null,
        },
      });

      return transaction;
    });

    return transaction;
  }
}
