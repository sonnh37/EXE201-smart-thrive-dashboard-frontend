'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { fetchOrders } from '@/services/order-service';
import { Order } from '@/types/order';
import { OrderGetAllQuery } from '@/types/queries/order-query';
const chartConfig = {
  price: {
    label: 'Visitors'
  },
  
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))'
  }
} satisfies ChartConfig;

interface PieGraphProps {
  queryParams: OrderGetAllQuery;
}

export const PieGraph: React.FC<PieGraphProps> = ({ queryParams }) => {
  const [orders, setOrders] = React.useState<Order[]>([]);

  const formattedData = React.useMemo(() => {
    const dailyTotals: { [key: string]: number } = {};
  
    orders.forEach(order => {
      const date = new Date(order.createdDate!).toLocaleDateString();
      dailyTotals[date] = (dailyTotals[date] || 0) + (order.totalPrice ?? 0);
    });
  
    // Chuyển đổi dailyTotals thành mảng để sử dụng cho BarChart
    return Object.entries(dailyTotals).map(([date, total]) => ({
      date: date,
      order: total,
    }));
  }, [orders]);

  React.useEffect(() => {
    const fetchData = async () => {
      const params: OrderGetAllQuery = {
        ...queryParams,
        isPagination: false, 
      };
        const response = await fetchOrders(params);
        console.log("check_dashboard_response", response.data)
        setOrders(response.data?.results?? []);
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
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Donut with Text</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[360px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={formattedData}
              dataKey="price"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
