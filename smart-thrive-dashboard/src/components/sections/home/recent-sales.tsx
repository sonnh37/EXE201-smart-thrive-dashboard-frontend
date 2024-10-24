// recent-sales.tsx
import {DataTable} from "@/components/common/data-table-generic/data-table";
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {OrderGetAllQuery} from "@/types/queries/order-query";
import React from "react";
import {columns} from "./columns";
import orderService from "@/services/order-service";

interface RecentSalesProps {
    queryParams: OrderGetAllQuery;
}

export const RecentSales: React.FC<RecentSalesProps> = ({queryParams}) => {
    return (
        <Card className="col-span-4 md:col-span-3">
            <CardHeader className="px-7">
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>View your recent sales data.</CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    fetchData={orderService.fetchAll}
                    columnSearch="id"
                    className="h-60"
                    defaultValues={queryParams}
                />
            </CardContent>
        </Card>
    );
};
