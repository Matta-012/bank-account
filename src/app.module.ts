import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [AccountModule, TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
