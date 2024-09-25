import { DataTablePagination } from "@/components/common/data-table-custom-api/data-table-pagination";
import { TableComponent } from "@/components/common/data-table-custom-api/table-component";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ColumnFilter,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { columns } from "./columns";

import { DataTableFacetedFilter } from "@/components/common/data-table-custom-api/data-table-faceted-filter";
import { DataTableSkeleton } from "@/components/common/data-table-custom-api/data-table-skelete";
import {
  isDeleted_options,
  status_order_options,
} from "@/components/common/filters";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { fetchOrder, fetchOrders } from "@/services/order-service";
import { OrderGetAllQuery } from "@/types/request/order-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { CSVLink } from "react-csv";
import {
  CalendarIcon,
  File,
  PlusCircle,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Const } from "@/lib/const";
import { useDebounce } from "@/hooks/use-debounce";
import { debounce, filter } from "lodash";

const DATE_REQUIRED_ERROR = "Date is required.";
const FormSchema = z.object({
  id: z.string().nullable().optional(),
  date: z
    .object(
      {
        from: z.date().optional(),
        to: z.date().optional(),
      },
      { required_error: "Date is required." }
    )
    .refine((date) => {
      return !!date.to;
    }, "End Date is required.")
    .optional(),
  description: z.string().optional(),
  isDeleted: z.boolean().nullable().optional(),
});

export default function DataTableOrders() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const queryClient = useQueryClient();
  const [shouldFetch, setShouldFetch] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const side = "left";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: "",
      date: {
        from: undefined,
        to: undefined,
      },
      isDeleted: null,
    },
  });

  const formValues = useWatch({
    control: form.control,
  });

  //const formValues = useDebounce(formWatch, 500); // Đợi 500ms trước khi gọi API

  //const debouncedColumnFilters = useDebounce(columnFilters, 100); // Đợi 500ms trước khi gọi API

  const getQueryParams = useCallback((): OrderGetAllQuery => {
    const filterParams: Record<string, any> = {};

    columnFilters.forEach((filter) => {
      filterParams[filter.id] = filter.value;
    });

    return {
      pageNumber: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      sortField: sorting.length > 0 ? sorting[0]?.id : "CreatedDate",
      sortOrder: sorting.length > 0 ? (sorting[0]?.desc ? -1 : 1) : -1,
      isPagination: true,
      fromDate: formValues?.date?.from?.toISOString() || undefined,
      toDate: formValues?.date?.to?.toISOString() || undefined,

      ...filterParams,
    };
  }, [pagination, sorting, formValues, columnFilters]);

  const queryParams = useMemo(() => getQueryParams(), [getQueryParams]);

  const { data, isFetching, error } = useQuery({
    queryKey: ["data", queryParams],
    queryFn: () => fetchOrders(queryParams),
    placeholderData: keepPreviousData,
    enabled: shouldFetch,
  });

  const handleFilterClick = () => {
    setIsSheetOpen(true);
    setShouldFetch(false);
    setIsClicked(true);
  };

  const table = useReactTable({
    data: data?.data?.results ?? [],
    columns,
    rowCount: data?.data?.totalRecords ?? 0,
    state: { pagination, sorting, columnFilters, columnVisibility },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSheetChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (open) {
      setIsClicked(false);
      setShouldFetch(false);
    } else {
      setIsClicked(true);
      setShouldFetch(true);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [pagination]);

  if (error) return <div>Error loading data</div>;

  const isFiltered = table.getState().columnFilters.length > 0;

  const stringObject = "Order";

  const handleClear = () => {
    form.reset();
  };
  return (
    <div ref={scrollRef} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter tasks..."
            value={
              (table.getColumn("description")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("description")?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />

          {table.getColumn("isDeleted") && (
            <DataTableFacetedFilter
              column={table.getColumn("isDeleted")}
              title="Is deleted"
              options={isDeleted_options}
            />
          )}

          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={status_order_options}
            />
          )}

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div>
            <Sheet
              key={side}
              open={isSheetOpen}
              onOpenChange={handleSheetChange}
            >
              <SheetTrigger>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1"
                  onClick={handleFilterClick}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span className=" sm:whitespace-nowrap">Filter Advanced</span>
                </Button>
              </SheetTrigger>

              <SheetContent side={side}>
                <Form {...form}>
                  <form className="space-y-8">
                    <SheetHeader>
                      <SheetTitle>Filter advanced</SheetTitle>
                      <SheetDescription>
                        This action can update when you click the button at the
                        footer.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  id="date"
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !field.value?.from &&
                                      "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value?.from ? (
                                    field.value?.to ? (
                                      <>
                                        {format(field.value.from, "LLL dd, y")}{" "}
                                        - {format(field.value.to, "LLL dd, y")}
                                      </>
                                    ) : (
                                      format(field.value.from, "LLL dd, y")
                                    )
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  initialFocus
                                  mode="range"
                                  defaultMonth={field.value?.from}
                                  selected={{
                                    from: field.value?.from!,
                                    to: field.value?.to,
                                  }}
                                  onSelect={field.onChange}
                                  numberOfMonths={2}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              The date you want to add a comment for.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Order description"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isDeleted"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                              <Select
                                value={
                                  field.value
                                    ? "Disactive"
                                    : field.value === false
                                    ? "Active"
                                    : "None"
                                }
                                onValueChange={(value) => {
                                  if (value === "None") {
                                    field.onChange(null);
                                  } else {
                                    field.onChange(value === "Disactive");
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="None">None</SelectItem>
                                  <SelectItem value="Active">Active</SelectItem>
                                  <SelectItem value="Disactive">
                                    Disactive
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <SheetFooter>
                      <SheetClose asChild>
                        <Button onClick={handleClear}>Clear filter</Button>
                      </SheetClose>
                    </SheetFooter>
                  </form>
                </Form>
              </SheetContent>
            </Sheet>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto hidden h-8 lg:flex"
              >
                <MixerHorizontalIcon className="mr-2 h-4 w-4" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <CSVLink filename="export_data.csv" data={data?.data?.results ?? []}>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className=" sm:whitespace-nowrap">Export CSV</span>
            </Button>
            
          </CSVLink>

          <Link
            className="text-primary-foreground sm:whitespace-nowrap"
            href={`${Const.URL_ORDER_NEW}`}
          >
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="fill-primary-background h-3.5 w-3.5" />
              Add {stringObject.toLowerCase()}
            </Button>
          </Link>
        </div>
      </div>
      {isFetching ? (
        <DataTableSkeleton
          columnCount={5}
          searchableColumnCount={1}
          filterableColumnCount={1}
          cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
          shrinkZero
        />
      ) : (
        <>
          <TableComponent table={table} />
          <DataTablePagination table={table} />
        </>
      )}
    </div>
  );
}
