import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text" })
  picture: string;

  @Column({ type: "int" })
  stock: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;
}
