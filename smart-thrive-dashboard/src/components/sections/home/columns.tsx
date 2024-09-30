"use client";

import { DataTableColumnHeader } from "@/components/common/data-table-generic/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { OrderStatus, PaymentMethod } from "@/types/enums/order";
import { Order } from "@/types/order";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => <div>Payment Method</div>,
    cell: ({ row }) => {
      const paymentMethod = row.getValue("paymentMethod") as PaymentMethod;
      const paymentMethodText = PaymentMethod[paymentMethod];

      return <span>{paymentMethodText}</span>;
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => <div>Status</div>,
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatus;
      const statusText = OrderStatus[status];

      let badgeVariant:
        | "secondary"
        | "destructive"
        | "default"
        | "outline"
        | null = "default";

      switch (status) {
        case OrderStatus.Pending:
          badgeVariant = "secondary";
          break;
        case OrderStatus.Completed:
          badgeVariant = "default";
          break;
        case OrderStatus.Cancelled:
          badgeVariant = "destructive";
          break;
        default:
          badgeVariant = "default";
      }

      return <Badge variant={badgeVariant}>{statusText}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => <div>Total price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalPrice"));

      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => <div>Data created</div>,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdDate"));
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
];
