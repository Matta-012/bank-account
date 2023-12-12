import { Injectable } from '@nestjs/common';
import { Account } from '@prisma/client';
import { IAccount } from './account.model';
import { PrismaService } from 'src/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

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
}
