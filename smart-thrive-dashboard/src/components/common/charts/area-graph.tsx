"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import React, { useEffect } from "react";
import { Order } from "@/types/order";
import { fetchOrders } from "@/services/order-service";
import { OrderGetAllQuery } from "@/types/request/order-query";

const chartConfig = {
  order: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;
interface AreaGraphProps {
  queryParams: OrderGetAllQuery;
}
export const AreaGraph: React.FC<AreaGraphProps> = ({ queryParams }) => {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("order");
  const [orders, setOrders] = React.useState<Order[]>([]);

  const formattedData = React.useMemo(() => {
    const dailyTotals: { [key: string]: number } = {};

    orders.forEach((order) => {
      const date = new Date(order.createdDate!).toLocaleDateString();
      dailyTotals[date] = (dailyTotals[date] || 0) + (order.totalPrice ?? 0);
    });

    // Chuyển đổi dailyTotals thành mảng để sử dụng cho BarChart
    return Object.entries(dailyTotals).map(([date, total]) => {
      const month = new Date(date).toLocaleString('default', { month: 'long' }); // Get month name
      return {
        month: month,
        order: total,
      };
    });
  }, [orders]);

  useEffect(() => {
    const fetchData = async () => {
      const params: OrderGetAllQuery = {
        ...queryParams,
        isPagination: false, 
        isFilter: true
      };
      const response = await fetchOrders(params);
      console.log("check_dashboard_response", response.data);
      setOrders(response.data?.results ?? []);
    };

    fetchData();
  }, [queryParams]);

  const total = React.useMemo(
    () => ({
      order: orders.reduce((acc, curr) => acc + (curr.totalPrice ?? 0), 0),
    }),
    [orders]
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart - Stacked</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[310px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={formattedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="order"
              type="natural"
              fill="var(--color-order)"
              fillOpacity={0.4}
              stroke="var(--color-order)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
