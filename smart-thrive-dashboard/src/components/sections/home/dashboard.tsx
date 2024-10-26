import { AreaGraph } from "@/components/common/charts/area-graph";
import { BarGraph } from "@/components/common/charts/bar-graph";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderGetAllQuery } from "@/types/queries/order-query";
import { endOfMonth, endOfWeek, endOfYear, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import { File } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { KPIStats } from "./kpi-stats";
import { RecentSales } from "./recent-sales";

const defaultQueryParams: OrderGetAllQuery = {
    isPagination: true,
    fromDate: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
    toDate: endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
};

export function Dashboard() {
    const [currentTab, setCurrentTab] = useState<string>("week");
    const [getQueryParams, setGetQueryParams] = useState<OrderGetAllQuery>(defaultQueryParams);
    const prevTabRef = useRef<string>("week");

    const tabItems = [
        {
            value: "week",
            label: "Week",
            description: "Recent orders from your store.",
        },
        { value: "month", label: "Month", description: "Orders from this month." },
        { value: "year", label: "Year", description: "Orders from this year." },
    ];

    const fetchOrders = () => {
        let query: OrderGetAllQuery;

        if (currentTab === "week") {
            query = {
                ...defaultQueryParams,
                fromDate: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
                toDate: endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
            };
        } else if (currentTab === "month") {
            query = {
                ...defaultQueryParams,
                fromDate: startOfMonth(new Date()).toISOString(),
                toDate: endOfMonth(new Date()).toISOString(),
            };
        } else { // year
            query = {
                ...defaultQueryParams,
                fromDate: startOfYear(new Date()).toISOString(),
                toDate: endOfYear(new Date()).toISOString(),
            };
        }

        setGetQueryParams(query);
    };

    useEffect(() => {
        if (prevTabRef.current !== currentTab) {
            fetchOrders(); // Gọi hàm fetch chỉ khi tab hiện tại khác với tab trước
            prevTabRef.current = currentTab; // Cập nhật tab trước
        }
    }, [currentTab, getQueryParams]);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                    Hi, Welcome back 👋
                </h2>
            </div>
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="analytics" disabled>
                        Analytics
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <KPIStats />
                    <Tabs
                        defaultValue="week"
                        onValueChange={(value) => {
                            setCurrentTab(value);
                        }}
                    >
                        <div className="flex items-center">
                            <TabsList>
                                {tabItems.map((tab) => (
                                    <TabsTrigger key={tab.value} value={tab.value}>
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            <div className="ml-auto flex items-center gap-2">
                                <DropdownMenu>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuCheckboxItem checked>
                                            Fulfilled
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Declined
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuCheckboxItem>
                                            Refunded
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 gap-1 text-sm"
                                >
                                    <File className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only">Export</span>
                                </Button>
                            </div>
                        </div>
                        {tabItems.map((tab) => (
                            <TabsContent key={tab.value} value={tab.value}>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                                    <div className="col-span-4">
                                        <BarGraph queryParams={getQueryParams} />
                                    </div>
                                    <RecentSales queryParams={getQueryParams} />
                                    <div className="col-span-full">
                                        <AreaGraph queryParams={getQueryParams} />
                                    </div>
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </TabsContent>
            </Tabs>
        </div>
    );
}
