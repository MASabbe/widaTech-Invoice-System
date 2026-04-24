import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from '../entities/Product';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async search(query: string) {
    if (!query) return [];
    return this.productRepository.find({
      where: { name: Like(`%${query}%`) },
      take: 5,
    });
  }
}
