import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';

@Controller('api/v1/transaction')
@ApiTags('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @HttpCode(200)
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<Transaction[]> {
    const pageToNumber = Number(page);
    const limitToNumber = Number(limit);

    const skip =
      pageToNumber > 0 && limitToNumber > 0
        ? (pageToNumber - 1) * limitToNumber
        : 0;
    const take = limitToNumber > 0 ? limitToNumber : 10;

    return this.transactionService.getAll(skip, take);
  }

  @Get(':transactionId')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The Account found',
    type: '',
  })
  async getById(
    @Param('transactionId') transactionId: string,
  ): Promise<Transaction> {
    const result = await this.transactionService.getById(transactionId);

    if (!result) {
      throw new HttpException('NotFoundException', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  @Get('accountNumber/:accountNumber')
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'The Account found',
    type: '',
  })
  async getByAccountNumber(
    @Param('accountNumber') accountNumber: string,
  ): Promise<Transaction[]> {
    const result = await this.transactionService.getByAccountNumber(
      Number(accountNumber),
    );

    if (!result) {
      throw new HttpException('NotFoundException', HttpStatus.NOT_FOUND);
    }

    return result;
  }
}
