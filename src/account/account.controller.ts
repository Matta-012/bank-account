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

@Controller('api/v1/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async getAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Res() response: Response,
  ) {
    const pageToNumber = Number(page);
    const limitToNumber = Number(limit);
    const skip =
      pageToNumber > 0 && limitToNumber > 0
        ? (pageToNumber - 1) * limitToNumber
        : 0;
    const take = limitToNumber > 0 ? limitToNumber : 10;

    const result = await this.accountService.getAll(skip, take);

    return response.status(200).json({
      status: 'Ok!',
      message: 'Succesfull',
      result: result,
    });
  }

  @Get(':accountNumber')
  async getById(
    @Param('accountNumber') accountNumber: string,
    @Res() response: Response,
  ) {
    const result = await this.accountService.getById(Number(accountNumber));

    if (!result) {
      throw new HttpException('NotFoundException', HttpStatus.NOT_FOUND);
    }

    return response.status(200).json({
      status: 'Ok!',
      message: 'Succesfull',
      result: result,
    });
  }
}
