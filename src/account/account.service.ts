import { Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { IAccount } from './account.model';
import { PrismaService } from 'src/prisma.service';

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
}
