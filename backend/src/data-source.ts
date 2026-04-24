import "reflect-metadata";
import { DataSource } from "typeorm";
import { Invoice } from "./entities/Invoice";
import { Product } from "./entities/Product";
import { InvoiceItem } from "./entities/InvoiceItem";

export const AppDataSource = new DataSource({
  type: "sqlite", // Using SQLite for demonstration, but entities are MySQL-compatible.
  database: "database.sqlite",
  synchronize: true,
  logging: false,
  entities: [Invoice, Product, InvoiceItem],
  subscribers: [],
  migrations: [],
});
