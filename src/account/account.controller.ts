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
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

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

  @Put('inactivate/:accountNumber')
  @HttpCode(200)
  async inactivate(
    @Param('accountNumber') accountNumber: string,
  ): Promise<Account> {
    return this.accountService.inactivate(Number(accountNumber));
  }

  @Put('activate/:accountNumber')
  @HttpCode(200)
  async activate(
    @Param('accountNumber') accountNumber: string,
  ): Promise<Account> {
    return this.accountService.activate(Number(accountNumber));
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
    type: CreateAccountDto,
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
