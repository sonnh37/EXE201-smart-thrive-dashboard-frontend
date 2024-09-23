import { BaseEntity } from './base';
import { Package } from './package';
import { Voucher } from './voucher';

export enum PaymentMethod {
  CreditCard = 1,
  DebitCard = 2,
  Cash = 3,
  BankTransfer = 4,
  // Add more payment methods as needed
}

export enum OrderStatus {
  Pending = 1,
  Completed = 2,
  Cancelled = 3,
  // Add more statuses as needed
}

export interface Order extends BaseEntity {
  packageId?: string;
  voucherId?: string;
  paymentMethod?: PaymentMethod;
  totalPrice?: number;
  description?: string;
  status?: OrderStatus;
  package?: Package;
  voucher?: Voucher;
}
