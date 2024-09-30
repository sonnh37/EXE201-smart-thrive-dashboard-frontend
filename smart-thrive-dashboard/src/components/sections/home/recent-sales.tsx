// recent-sales.tsx
import { DataTable } from "@/components/common/data-table-generic/data-table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { fetchOrders } from "@/services/order-service";
import { OrderGetAllQuery } from "@/types/request/order-query";
import React from "react";
import { columns } from "./columns";

interface RecentSalesProps {
  queryParams: OrderGetAllQuery;
}

export const RecentSales: React.FC<RecentSalesProps> = ({ queryParams }) => {
  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>View your recent sales data.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          fetchData={fetchOrders}
          columnSearch="id"
          defaultValues={queryParams}
        />
      </CardContent>
    </Card>
  );
};
