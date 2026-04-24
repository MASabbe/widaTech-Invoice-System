import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createServer as createViteServer } from 'vite';
import * as express from 'express';
import { AppDataSource } from './src/server/data-source';
import { InvoiceModule } from './src/server/invoice/invoice.module';
import { Product } from './src/server/entities/Product';
import { Invoice } from './src/server/entities/Invoice';
import { InvoiceItem } from './src/server/entities/InvoiceItem';
import { ProductModule } from './src/server/product/product.module'; // Will create this next
import path from 'path';

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
class AppModule {}

async function bootstrap() {
  const server = express();
  const PORT = 3000;

  // 1. Initialize DB Seeding (Optional, for demo)
  await AppDataSource.initialize();
  const productRepo = AppDataSource.getRepository(Product);
  if (await productRepo.count() === 0) {
    await productRepo.save([
      { name: "MacBook Pro M3", picture: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200", stock: 10, price: 1999.00 },
      { name: "iPhone 15 Pro", picture: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=200", stock: 25, price: 999.00 },
      { name: "AirPods Max", picture: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=200", stock: 15, price: 549.00 },
    ]);
  }

  // 2. Setup NestJS App
  const app = await NestFactory.create(AppModule, { 
    bodyParser: true 
  });
  
  // 3. Setup Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
  }

  await app.listen(PORT, "0.0.0.0");
  console.log(`Server running on http://localhost:${PORT}`);
}

bootstrap();
