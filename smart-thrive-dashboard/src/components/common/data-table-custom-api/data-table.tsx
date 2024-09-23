"use client"

import * as React from "react"
import {useEffect, useRef} from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    PaginationState,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"

import {keepPreviousData, useQuery,} from '@tanstack/react-query'

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {DataTablePagination} from "@/components/dashboard/data-table/data-table-pagination";
import {BaseQueryableQuery} from "@/types/queries/base-query";
import {DataTableToolbar} from "@/components/dashboard/data-table/data-table-toolbar";
import BarLoader from "@/components/common/bar-loader"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    fetchData: (queryParams: BaseQueryableQuery) => Promise<PagedResponse<TData>>;
    stringObject: string
}

export function DataTable<TData, TValue>({
                                             columns,
                                             fetchData,
                                             stringObject
                                         }: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const isDeletedFilter = columnFilters.find(filter => filter.id === 'isDeleted');
    const isDeleted = isDeletedFilter ? isDeletedFilter.value as boolean : undefined;

    const [queryParams, setQueryParams] = React.useState<BaseQueryableQuery>({
        pageNumber: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sortField: sorting.length > 0 ? sorting[0]?.id : 'CreatedDate',
        sortOrder: sorting.length > 0 ? (sorting[0]?.desc ? -1 : 1) : 1,
        isPagination: true,
    });

    useEffect(() => {
        const isDeletedFilter = columnFilters.find(filter => filter.id === 'isDeleted');
        const isDeleted = isDeletedFilter ? isDeletedFilter.value as boolean : undefined;
        setQueryParams({
            pageNumber: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
            sortField: sorting.length > 0 ? sorting[0]?.id : '',
            sortOrder: sorting.length > 0 ? (sorting[0]?.desc ? -1 : 1) : 1,
            isPagination: true,
        });
    }, [pagination, sorting, columnFilters]);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [pagination]);

    const {data, isFetching, error} = useQuery({
        queryKey: ['data', queryParams],
        queryFn: () => fetchData(queryParams),
        placeholderData: keepPreviousData,
    });

    const defaultData: TData[] = React.useMemo(() => [], []);

    const table = useReactTable({
        data: data?.results ?? defaultData,
        columns,
        rowCount: data?.totalRecords ?? 0,
        onPaginationChange: (newPagination) => setPagination(newPagination),
        onSortingChange: (newSorting) => setSorting(newSorting),
        getCoreRowModel: getCoreRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        manualPagination: true,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        debugTable: true,
        state: {
            pagination,
            sorting,
            columnFilters,
            columnVisibility
        },
    });

    if (isFetching) return <div><BarLoader/></div>;
    if (error) return <div>Error loading data</div>;

    return (
        <div ref={scrollRef} className="space-y-4">
            <DataTableToolbar stringObject={stringObject} table={table}/>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table}/>
        </div>

    )
}


