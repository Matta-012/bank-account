import { Injectable } from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { ITransaction } from './transaction.model';

@Injectable()
export class TransactionService implements ITransaction {
  constructor(private prisma: PrismaService) {}

  async getAll(page: number, limit: number): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      skip: page,
      take: limit,
    });
  }

  async getById(id: string): Promise<Transaction> {
    return this.prisma.transaction.findFirst({
      where: { id },
    });
  }

  async getByAccountNumber(accountNumber: number): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: { account_number: accountNumber },
    });
  }
}
