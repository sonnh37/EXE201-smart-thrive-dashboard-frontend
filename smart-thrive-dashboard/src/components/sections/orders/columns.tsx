"use client";

import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import Actions from "./actions";
import { DataTableColumnHeader } from "@/components/common/data-table-custom-api/data-table-column-header";
import { Order } from "@/types/order";
import { OrderStatus, PaymentMethod } from "@/types/enums/order";

export const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Price" />
    ),
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
    accessorKey: "paymentMethod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Method" />
    ),
    cell: ({ row }) => {
      const paymentMethod = row.getValue("paymentMethod") as PaymentMethod;
      const paymentMethodText = PaymentMethod[paymentMethod];

      return <span>{paymentMethodText}</span>;
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <div className="truncate max-w-xs">{row.getValue("description")}</div>
      );
    },
  },
  {
    accessorKey: "createdDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdDate"));
      return date.toLocaleDateString("en-US", {
        weekday: "short", // Thu
        year: "numeric", // 2022
        month: "short", // Oct
        day: "numeric", // 20
      });
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
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
  },
  {
    accessorKey: "isDeleted",
    header: ({ column }) => <DataTableColumnHeader column={column} title="" />,
    cell: ({ row }) => {
      const isDeleted = row.getValue("isDeleted") as boolean;
      if (!isDeleted) {
        return <Badge variant="secondary">Active</Badge>;
      }
      return <Badge variant="destructive">Deactivate</Badge>;
    },
    filterFn: (row, id, value) => {
      const isDeletedValue = row.getValue(id) as boolean;
      return value.includes(isDeletedValue.toString()); // Chuyển đổi boolean sang string để so sánh
    },
    enableGlobalFilter: false,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const model = row.original;
      return <Actions id={model.id} />;
    },
  },
];
