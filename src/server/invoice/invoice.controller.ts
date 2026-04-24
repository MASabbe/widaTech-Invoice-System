import { Controller, Get, Post, Body, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { InvoiceService } from './invoice.service';

@Controller('api/invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async create(@Body() createInvoiceDto: any) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    return this.invoiceService.findAll(page, limit);
  }

  @Get('analytics')
  async getAnalytics(@Query('period') period: 'daily' | 'weekly' | 'monthly' = 'daily') {
    return this.invoiceService.getAnalytics(period);
  }
}
