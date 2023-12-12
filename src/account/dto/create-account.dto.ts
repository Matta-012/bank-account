import { IsDecimal, IsInt } from 'class-validator';

export class CreatAccountDto {
  @IsInt()
  branch_id: number;

  @IsInt()
  account_type_id: number;

  @IsDecimal()
  balance: number;
}
