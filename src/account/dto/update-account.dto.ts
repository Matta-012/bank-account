import { IsInt } from 'class-validator';

export class UpdateAccountDto {
  @IsInt()
  branch_id: number;

  @IsInt()
  account_type_id: number;
}
