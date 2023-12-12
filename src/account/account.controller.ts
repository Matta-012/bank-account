import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AccountService } from './account.service';
import { Account } from '@prisma/client';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatAccountDto } from './dto/create-account.dto';

@Controller('api/v1/account')
@ApiTags('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() createAccountDto: CreatAccountDto): Promise<Account> {
    return this.accountService.create(createAccountDto);
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
  @ApiResponse({
    status: 200,
    description: 'The Account found',
    type: CreatAccountDto,
  })
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
