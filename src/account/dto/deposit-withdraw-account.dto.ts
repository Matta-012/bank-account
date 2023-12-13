import { IsDecimal, IsOptional, IsPositive, IsString } from 'class-validator';

export class DepositWithdrawAccountDto {
  @IsDecimal()
  @IsPositive()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;
}
