import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { InvoiceItem } from "./InvoiceItem";

@Entity("invoices")
export class Invoice {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "datetime" })
  date: Date;

  @Column({ type: "varchar", length: 255 })
  customerName: string;

  @Column({ type: "varchar", length: 255 })
  salespersonName: string;

  @Column({ type: "decimal", precision: 15, scale: 2 })
  totalAmount: number;

  @Column({ type: "text", nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  items: InvoiceItem[];
}
