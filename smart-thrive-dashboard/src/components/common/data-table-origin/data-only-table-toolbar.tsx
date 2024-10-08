"use client"

import type {Table} from "@tanstack/react-table"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {X} from "lucide-react"
import { DataOnlyTableViewOptions } from "./data-only-table-view-options"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export function DataOnlyTableToolbar<TData>({
                                                table,
                                            }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter tasks..."
                    value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("title")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {/*{table.getColumn("status") && (*/}
                {/*    <DataOnlyTableFacetedFilter*/}
                {/*        column={table.getColumn("status")}*/}
                {/*        title="Status"*/}
                {/*        options={status_options}*/}
                {/*    />*/}
                {/*)}*/}
                {/*{table.getColumn("priority") && (*/}
                {/*    <DataOnlyTableFacetedFilter*/}
                {/*        column={table.getColumn("priority")}*/}
                {/*        title="Priority"*/}
                {/*        options={priority_options}*/}
                {/*    />*/}
                {/*)}*/}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4"/>
                    </Button>
                )}
            </div>
            <DataOnlyTableViewOptions table={table}/>
        </div>
    )
}