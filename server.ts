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
  const PORT = process.env.PORT || 3000;

  // Initialize DB Connection
  await AppDataSource.initialize();
  console.log("Database Connection Initialized");

  const productRepo = AppDataSource.getRepository(Product);
  const invoiceRepo = AppDataSource.getRepository(Invoice);

  // 1. Seed Products if empty
  if (await productRepo.count() === 0) {
    await productRepo.save([
      { name: "MacBook Pro M3", picture: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200", stock: 10, price: 1999.00 },
      { name: "iPhone 15 Pro", picture: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=200", stock: 25, price: 999.00 },
      { name: "AirPods Max", picture: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=200", stock: 15, price: 549.00 },
    ]);
  }

  // 2. Seed Sample Invoices from provided image if empty
  if (await invoiceRepo.count() === 0) {
    const products = await productRepo.find();
    const sampleInvoices = [
      { date: "2021-01-01", customer: "John", sales: "Doe", notes: "Lorem ipsum" },
      { date: "2021-01-01", customer: "John", sales: "Doe", notes: "Lorem ipsum" },
      { date: "2021-01-03", customer: "Jane", sales: "Doe", notes: "Lorem ipsum" },
      { date: "2021-01-04", customer: "Rock", sales: "Pete", notes: "Lorem ipsum" },
      { date: "2021-01-04", customer: "Frank", sales: "Internal", notes: "Lorem ipsum" },
      { date: "2021-01-05", customer: "Jeff", sales: "Pete", notes: "Lorem ipsum" },
    ];

    for (const data of sampleInvoices) {
      const invoice = invoiceRepo.create({
        customerName: data.customer,
        salespersonName: data.sales,
        date: new Date(data.date),
        notes: data.notes,
        totalAmount: products[0].price,
        items: [{
          product: products[0],
          quantity: 1,
          priceAtPurchase: products[0].price
        }]
      });
      await invoiceRepo.save(invoice);
    }
    console.log("Sample data seeded from input image.");
  }

  // 3. Setup NestJS App
  const app = await NestFactory.create(AppModule);
  
  // Set global prefix for all controllers
  app.setGlobalPrefix('api');
  
  app.enableCors();
  
  // 4. Setup Delivery Strategy
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    
    // Mount Vite middleware. NestJS controllers are registered first, 
    // so API routes will be handled before reaching this middleware.
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    // Serve static files for production
    app.use(express.static(distPath));
    
    // SPA Fallback for production: If not an API route, serve index.html
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.get('*', (req: any, res: any, next: any) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(distPath, "index.html"));
      } else {
        next();
      }
    });
  }

  await app.listen(PORT, "0.0.0.0");
  console.log(`Server environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Production-ready server running on http://localhost:${PORT}`);
}

bootstrap();
