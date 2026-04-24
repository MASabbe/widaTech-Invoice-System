import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, DataSource } from 'typeorm';
import { Invoice } from '../../entities/Invoice';
import { InvoiceItem } from '../../entities/InvoiceItem';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    private dataSource: DataSource,
  ) {}

  /**
   * Create Invoice dengan Transaction (Atomic)
   */
  async create(createInvoiceDto: any): Promise<Invoice> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { customerName, salespersonName, date, notes, items, paymentType } = createInvoiceDto;

      // 1. Hitung totalAmount di server untuk validasi (Anti-tamper)
      const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

      const invoice = this.invoiceRepository.create({
        customerName,
        salespersonName,
        date: new Date(date),
        notes,
        paymentType: paymentType || 'CASH',
        totalAmount,
      });

      const savedInvoice = await queryRunner.manager.save(invoice);

      // 2. Map items ke entitas InvoiceItem
      const invoiceItems = items.map((item) => {
        const invoiceItem = new InvoiceItem();
        invoiceItem.product = { id: item.productId } as any;
        invoiceItem.quantity = item.quantity;
        invoiceItem.priceAtPurchase = item.price;
        invoiceItem.invoice = savedInvoice;
        return invoiceItem;
      });

      await queryRunner.manager.save(invoiceItems);
      await queryRunner.commitTransaction();

      return savedInvoice;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('Failed to create invoice: ' + err.message);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get Invoices dengan Pagination & Meta
   */
  async findAll(page: number = 1, limit: number = 10) {
    const [data, total] = await this.invoiceRepository.findAndCount({
      order: { date: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Analytics - Efficient Time Series Query (Raw SQL Optimization)
   */
  async getAnalytics(period: 'daily' | 'weekly' | 'monthly') {
    const now = new Date();
    let startDate: Date;
    let groupByFormat: string;

    // Untuk MySQL, format grouping disesuaikan
    if (period === 'monthly') {
      startDate = startOfMonth(now);
      groupByFormat = '%Y-%m';
    } else if (period === 'weekly') {
      startDate = startOfWeek(now);
      groupByFormat = '%X-W%V'; // Year and Week
    } else {
      startDate = startOfDay(now);
      groupByFormat = '%Y-%m-%d %H:00';
    }

    // QueryBuilder untuk performa tinggi & mencegah N+1
    return this.invoiceRepository
      .createQueryBuilder('invoice')
      .select(`DATE_FORMAT(invoice.date, '${groupByFormat}')`, 'name')
      .addSelect('SUM(invoice.totalAmount)', 'value')
      .where('invoice.date >= :startDate', { startDate })
      .groupBy('name')
      .orderBy('name', 'ASC')
      .getRawMany();
  }
}
