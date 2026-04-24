import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppDataSource } from './data-source';
import { Product } from './entities/Product';
import { Invoice } from './entities/Invoice';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('WidaTech POS API')
    .setDescription('Professional Point of Sale Modular API Documentation')
    .setVersion('1.0')
    .addTag('invoices')
    .addTag('products')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Initialize DB Seeding
  await AppDataSource.initialize();
  const productRepo = AppDataSource.getRepository(Product);
  const invoiceRepo = AppDataSource.getRepository(Invoice);

  if ((await productRepo.count()) === 0) {
    await productRepo.save([
      { name: "MacBook Pro M3", picture: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200", stock: 10, price: 1999.00 },
      { name: "iPhone 15 Pro", picture: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=200", stock: 25, price: 999.00 },
      { name: "AirPods Max", picture: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=200", stock: 15, price: 549.00 },
      { name: "iPad Pro 12.9", picture: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200", stock: 12, price: 1099.00 },
      { name: "Magic Keyboard", picture: "https://images.unsplash.com/photo-1587829741301-dc798b83dadc?w=200", stock: 30, price: 299.00 },
    ]);
    console.log("Products seeded");
  }

  // Seed Sample Invoices if empty
  if ((await invoiceRepo.count()) === 0) {
    const products = await productRepo.find();
    const sampleInvoices = [
      { date: "2021-01-01", customer: "John", sales: "Doe", notes: "Lorem ipsum", paymentType: "CASH" },
      { date: "2021-01-01", customer: "John", sales: "Doe", notes: "Lorem ipsum", paymentType: "CASH" },
      { date: "2021-01-03", customer: "Jane", sales: "Doe", notes: "Lorem ipsum", paymentType: "CREDIT" },
      { date: "2021-01-04", customer: "Rock", sales: "Pete", notes: "Lorem ipsum", paymentType: "TRANSFER" },
      { date: "2021-01-04", customer: "Frank", sales: "Internal", notes: "Lorem ipsum", paymentType: "CASH" },
      { date: "2021-01-05", customer: "Jeff", sales: "Pete", notes: "Lorem ipsum", paymentType: "TRANSFER" },
    ];

    for (const data of sampleInvoices) {
      const invoice = invoiceRepo.create({
        customerName: data.customer,
        salespersonName: data.sales,
        date: new Date(data.date),
        notes: data.notes,
        paymentType: data.paymentType,
        totalAmount: products[0].price,
        items: [{
          product: products[0],
          quantity: 1,
          priceAtPurchase: products[0].price
        }]
      });
      await invoiceRepo.save(invoice);
    }
    console.log("Sample invoices seeded");
  }

  await app.listen(3001);
  console.log('Backend API is running on: http://localhost:3001');
}
bootstrap();
