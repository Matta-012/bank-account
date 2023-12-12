import { Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { IAccount } from './account.model';
import { PrismaService } from 'src/prisma.service';
import { CreatAccountDto } from './dto/create-account.dto';

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

  async create(accountData: CreatAccountDto): Promise<Account> {
    return this.prisma.account.create({
      data: accountData,
    });
  }
}
