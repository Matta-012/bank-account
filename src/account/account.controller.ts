import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Account, Transaction } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DepositWithdrawAccountDto } from './dto/deposit-withdraw-account.dto';

@Controller('api/v1/account')
@ApiTags('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountService.create(createAccountDto);
  }

  @Put(':accountNumber')
  @HttpCode(200)
  async update(
    @Param('accountNumber') accountNumber: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    return this.accountService.update(Number(accountNumber), updateAccountDto);
  }

  @Put(':accountNumber/inactivate')
  @HttpCode(200)
  async inactivate(
    @Param('accountNumber') accountNumber: string,
  ): Promise<Account> {
    return this.accountService.inactivate(Number(accountNumber));
  }

  @Put(':accountNumber/activate')
  @HttpCode(200)
  async activate(
    @Param('accountNumber') accountNumber: string,
  ): Promise<Account> {
    return this.accountService.activate(Number(accountNumber));
  }

  @Put(':accountNumber/deposit')
  @HttpCode(200)
  async deposit(
    @Param('accountNumber') accountNumber: string,
    @Body() depositWithdrawAccountDto: DepositWithdrawAccountDto,
  ): Promise<Transaction> {
    const [, transaction] = await this.accountService.deposit(
      Number(accountNumber),
      depositWithdrawAccountDto,
    );

    return transaction;
  }

  @Put(':accountNumber/withdraw')
  @HttpCode(200)
  async withdraw(
    @Param('accountNumber') accountNumber: string,
    @Body() depositWithdrawAccountDto: DepositWithdrawAccountDto,
  ): Promise<Transaction> {
    try {
      const transaction = await this.accountService.withdraw(
        Number(accountNumber),
        depositWithdrawAccountDto,
      );

      return transaction;
    } catch (error) {
      if (error.response.status === 400) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Insufficient funds',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @Get()
  @HttpCode(200)
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<Account[]> {
    const pageToNumber = Number(page);
    const limitToNumber = Number(limit);

    const skip =
      pageToNumber > 0 && limitToNumber > 0
        ? (pageToNumber - 1) * limitToNumber
        : 0;
    const take = limitToNumber > 0 ? limitToNumber : 10;

    return this.accountService.getAll(skip, take);
  }

  @Get(':accountNumber')
  @HttpCode(200)
  async getById(
    @Param('accountNumber') accountNumber: string,
  ): Promise<Account> {
    const result = await this.accountService.getById(Number(accountNumber));

    if (!result) {
      throw new HttpException('NotFoundException', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
