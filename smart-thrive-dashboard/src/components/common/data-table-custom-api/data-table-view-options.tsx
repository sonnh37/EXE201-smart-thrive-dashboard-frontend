"use client"

import {DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu"
import {MixerHorizontalIcon} from "@radix-ui/react-icons"
import {Table} from "@tanstack/react-table"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {File, PlusCircle} from "lucide-react";
import Link from "next/link";
import React from "react";

interface DataTableViewOptions<TData> {
    table: Table<TData>
    stringObject: string
}

export function DataTableViewOptions<TData>({
                                                table,
                                                stringObject
                                            }: DataTableViewOptions<TData>) {
    return (
        <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>

                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto hidden h-8 lg:flex"
                    >
                        <MixerHorizontalIcon className="mr-2 h-4 w-4"/>
                        View
                    </Button>

                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[150px]">
                    <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                    <DropdownMenuSeparator/>
                    {table
                        .getAllColumns()
                        .filter(
                            (column) =>
                                typeof column.accessorFn !== "undefined" && column.getCanHide()
                        )
                        .map((column) => {
                            return (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            )
                        })}
                </DropdownMenuContent>
            </DropdownMenu>


            <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5"/>
                <span className=" sm:whitespace-nowrap">Export</span>
            </Button>

            <Link
                className="text-primary-foreground sm:whitespace-nowrap"
                href={`/dashboard/${stringObject.toLowerCase()}/new`}
            >

                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="fill-primary-background h-3.5 w-3.5"/>
                    Add {stringObject.toLowerCase()}
                </Button>

            </Link>
        </div>
    )
}
