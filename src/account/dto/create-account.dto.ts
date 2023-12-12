import { IsDecimal, IsInt } from 'class-validator';

export class CreateAccountDto {
  @IsInt()
  branch_id: number;

  @IsInt()
  account_type_id: number;

  @IsDecimal()
  balance: number;
}
