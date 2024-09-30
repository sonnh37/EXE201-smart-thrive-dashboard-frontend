import { AreaGraph } from "@/components/common/charts/area-graph";
import { BarGraph } from "@/components/common/charts/bar-graph";
import { PieGraph } from "@/components/common/charts/pie-graph";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderGetAllQuery } from "@/types/request/order-query";
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { useEffect, useState } from "react";
import { RecentSales } from "./recent-sales";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter, File } from "lucide-react";
import { Button } from "@/components/ui/button";
interface WeekRange {
  start: string;
  end: string;
}

const defaultQueryParams: OrderGetAllQuery = {
  isPagination: true,
  pageNumber: 1,
  pageSize: 10,
};
export function Dashboard() {
  const [currentTab, setCurrentTab] = useState<string>("week");
  const [getQueryParams, setGetQueryParams] =
    useState<OrderGetAllQuery>(defaultQueryParams);
  const [weekRange, setWeekRange] = useState<WeekRange>({ start: "", end: "" });
  const tabItems = [
    {
      value: "week",
      label: "Week",
      description: "Recent orders from your store.",
    },
    { value: "month", label: "Month", description: "Orders from this month." },
    { value: "year", label: "Year", description: "Orders from this year." },
  ];
  const fetchOrdersForWeek = () => {
    const query: OrderGetAllQuery = {
      ...defaultQueryParams,
      fromDate: startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
      toDate: endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(),
    };
    setGetQueryParams(query);
  };

  const fetchOrdersForMonth = () => {
    const query: OrderGetAllQuery = {
      ...defaultQueryParams,
      fromDate: startOfMonth(new Date()).toISOString(),
      toDate: endOfMonth(new Date()).toISOString(),
    };
    setGetQueryParams(query);
  };

  const fetchOrdersForYear = () => {
    const query: OrderGetAllQuery = {
      ...defaultQueryParams,
      fromDate: startOfYear(new Date()).toISOString(),
      toDate: endOfYear(new Date()).toISOString(),
    };
    setGetQueryParams(query);
  };

  useEffect(() => {
    if (currentTab === "week") {
      fetchOrdersForWeek();
    } else if (currentTab === "month") {
      fetchOrdersForMonth();
    } else if (currentTab === "year") {
      fetchOrdersForYear();
    }
  }, [currentTab]);

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
          <div className="hidden items-center space-x-2 md:flex">
            {/* <CalendarDateRangePicker />
            <Button>Download</Button> */}
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscriptions
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sales</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12,234</div>
                  <p className="text-xs text-muted-foreground">
                    +19% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Now
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
            <Tabs
              defaultValue="week"
              onValueChange={(value) => setCurrentTab(value)}
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
                    <Card className="col-span-4 md:col-span-3">
                      <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
                        <CardDescription>
                          You made 265 sales this month.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RecentSales queryParams={getQueryParams} />
                      </CardContent>
                    </Card>
                    <div className="col-span-4">
                      <AreaGraph />
                    </div>
                    <div className="col-span-4 md:col-span-3">
                      <PieGraph />
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
