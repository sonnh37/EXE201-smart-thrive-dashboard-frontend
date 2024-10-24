"use client";

import * as React from "react";
import {useEffect} from "react";
import {Bar, BarChart, CartesianGrid, XAxis} from "recharts";

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card";
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart";
import orderService from "@/services/order-service";
import {Order} from "@/types/order";
import {OrderGetAllQuery} from "@/types/queries/order-query";

export const description = "An interactive bar chart";
const chartConfig = {
    views: {
        label: "Page Views",
    },
    order: {
        label: "Order",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

interface BarGraphProps {
    queryParams: OrderGetAllQuery;
}

export const BarGraph: React.FC<BarGraphProps> = ({queryParams}) => {
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
        return Object.entries(dailyTotals).map(([date, total]) => ({
            date: date,
            order: total,
        }));
    }, [orders]);

    useEffect(() => {
        const fetchData = async () => {
            const params: OrderGetAllQuery = {
                ...queryParams,
                isPagination: false,
            };
            const response = await orderService.fetchAll(params);
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
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Bar Chart - Interactive</CardTitle>
                    <CardDescription>
                        Showing total visitors for the last 3 months
                    </CardDescription>
                </div>
                <div className="flex">
                    {["order"].map((key) => {
                        const chart = key as keyof typeof chartConfig;
                        return (
                            <button
                                key={chart}
                                data-active={activeChart === chart}
                                className="relative flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                                onClick={() => setActiveChart(chart)}
                            >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
                                <span className="text-lg font-bold leading-none sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                  })}
                </span>
                            </button>
                        );
                    })}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[280px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={formattedData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false}/>
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                });
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        });
                                    }}
                                />
                            }
                        />
                        <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`}/>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
};
