import { DataTableFacetedFilter } from "@/components/common/data-table-custom-api/data-table-faceted-filter";
import { DataTableSkeleton } from "@/components/common/data-table-custom-api/data-table-skelete";
import { TableComponent } from "@/components/common/data-table-custom-api/table-component";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { FilterEnum } from "@/types/filter-enum";
import { FormFilterAdvanced } from "@/types/form-filter-advanced";
import { BaseQueryableQuery } from "@/types/request/base-query";
import { BusinessResult } from "@/types/response/business-result";
import { zodResolver } from "@hookform/resolvers/zod";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import { PlusCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CSVLink } from "react-csv";
import { useForm, useWatch } from "react-hook-form";
import { FiFilter } from "react-icons/fi";
import { MdOutlineFileDownload } from "react-icons/md";
import { z, ZodObject } from "zod";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  fetchData: (
    queryParams: BaseQueryableQuery
  ) => Promise<BusinessResult<PagedResponse<TData>>>;
  columnSearch: string;
  filterEnums: FilterEnum[];
  formSchema: ZodObject<any>;
  formFilterAdvanceds: FormFilterAdvanced[];
}

export function DataTableGeneric<TData>({
  columns,
  fetchData,
  filterEnums,
  columnSearch,
  formSchema,
  formFilterAdvanceds,
}: DataTableProps<TData>) {
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
  const [isTyping, setIsTyping] = useState(false);
  const side = "left";
  const pathname = usePathname();
  const [initialColumnValues, setInitialColumnValues] = useState<
    Record<string, any>
  >({});

  const getDefaultValues = () => {
    return formFilterAdvanceds.reduce(
      (
        acc: { [x: string]: any },
        field: { name: string | number; defaultValue: any }
      ) => {
        if ("defaultValue" in field) {
          acc[field.name] = field.defaultValue;
        }
        console.log(field.name, field.defaultValue);
        return acc;
      },
      {} as Record<string, any>
    );
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });

  const formValues = useWatch({
    control: form.control,
  });

  const getQueryParams = useCallback((): BaseQueryableQuery => {
    const filterParams: Record<string, any> = {};

    columnFilters.forEach((filter) => {
      filterParams[filter.id] = filter.value;
    });

    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        filterParams[key] = value;
      }
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
    queryFn: () => fetchData(queryParams),
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
    if (columnFilters.length > 0 || formValues) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: 0,
      }));
    }
  }, [columnFilters, formValues]);

  useEffect(() => {
    const field = table.getColumn(columnSearch)?.getFilterValue() as string;
    if (field && field.length > 0) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [table.getColumn(columnSearch)?.getFilterValue()]);

  if (error) return <div>Error loading data</div>;

  const isFiltered = table.getState().columnFilters.length > 0;

  const renderFormFields = () => {
    return formFilterAdvanceds.map((fieldConfig: any) => (
      <FormField
        key={fieldConfig.name}
        control={form.control}
        name={fieldConfig.name}
        render={fieldConfig.render}
      />
    ));
  };

  const handleClear = () => {
    form.reset();
  };
  return (
    <div ref={scrollRef} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder={`Enter ${columnSearch}...`}
            value={
              (table.getColumn(columnSearch)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(columnSearch)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
          {filterEnums.map((filter: any) => {
            const column = table.getColumn(filter.columnId);
            if (column) {
              return (
                <DataTableFacetedFilter
                  key={filter.columnId}
                  column={column}
                  title={filter.title}
                  options={filter.options}
                />
              );
            }
            return null;
          })}

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
          {/* Hand by hand */}
          <Sheet key={side} open={isSheetOpen} onOpenChange={handleSheetChange}>
            <SheetTrigger>
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1"
                onClick={handleFilterClick}
              >
                <FiFilter className="h-4 w-4" />
                {/* <span className=" sm:whitespace-nowrap">Filter Advanced</span> */}
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
                  <div className="grid gap-4 py-4">{renderFormFields()}</div>

                  <SheetFooter>
                    <SheetClose asChild>
                      <Button onClick={handleClear}>Clear filter</Button>
                    </SheetClose>
                  </SheetFooter>
                </form>
              </Form>
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto hidden h-8 lg:flex"
              >
                <MixerHorizontalIcon className="h-4 w-4" />
                {/* View */}
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

          <CSVLink
            filename="export_data.csv"
            data={(data?.data?.results as any[]) || []}
            target="_blank"
          >
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <MdOutlineFileDownload className="h-4 w-4" />
            </Button>
          </CSVLink>

          <Link
            className="text-primary-foreground sm:whitespace-nowrap"
            href={`${pathname}/new`}
          >
            <motion.div
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 6px 20px rgba(0,118,255,0.23)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="sm"
                className="space-x-2 shadow-[0_4px_14px_0_rgb(0,118,255,79%)] hover:shadow-[0_6px_20px_rgba(0,118,255,23%)] font-light transition duration-300 ease-linear"
              >
                <PlusCircle className="fill-primary-background h-5 w-5" />
                {/* Add */}
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
      {isFetching && !isTyping ? (
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
        </>
      )}
    </div>
  );
}
