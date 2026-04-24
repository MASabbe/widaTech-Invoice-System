import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { ProductModule } from './modules/product/product.module';
import { Invoice } from './entities/Invoice';
import { InvoiceItem } from './entities/InvoiceItem';
import { Product } from './entities/Product';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [Invoice, InvoiceItem, Product],
      synchronize: true,
    }),
    InvoiceModule,
    ProductModule,
  ],
})
export class AppModule {}
