import { IsDecimal, IsOptional, IsString } from 'class-validator';

export class DepositWithdrawAccountDto {
  @IsDecimal()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;
}
