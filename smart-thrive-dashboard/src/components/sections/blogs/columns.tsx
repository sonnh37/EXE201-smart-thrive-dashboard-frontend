"use client";

import {DataTableColumnHeader} from "@/components/common/data-table-generic/data-table-column-header";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {Blog} from "@/types/blog";
import {ColumnDef} from "@tanstack/react-table";
import Actions from "./actions";
import Image from "next/image";

export const columns: ColumnDef<Blog>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => {

            const isDeleted = row.getValue("isDeleted") as boolean;
            if (isDeleted) {
                return <></>;
            }
            return <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />;
        },

        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "backgroundImage",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Image"/>
        ),
        cell: ({row}) => {
            const imageUrl = row.getValue("backgroundImage") as string;
            return (
                <Image
                    src={imageUrl}
                    alt="Background"
                    width={100}
                    height={100}
                    style={{objectFit: 'cover'}}
                />
            );
        },
    },
    {
        accessorKey: "title",
        header: ({column}) => <DataTableColumnHeader column={column} title="Title"/>,
    },
    {
        accessorKey: "description",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Description"/>
        ),
        cell: ({row}) => {
            return (
                <div className="truncate max-w-xs">{row.getValue("description")}</div>
            );
        },
    },
    {
        accessorKey: "createdDate",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Data created"/>
        ),
        cell: ({row}) => {
            const date = new Date(row.getValue("createdDate"));
            return date.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        },
    },
    {
        accessorKey: "isActive",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Is Active"/>
        ),
        cell: ({row}) => {
            const isDeleted = row.getValue("isActive") as boolean;
            if (!isDeleted) {
                return <Badge variant="default">Displaying</Badge>;
            }
            return <Badge variant="secondary">Not show</Badge>;
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: "isDeleted",
        header: ({column}) => <DataTableColumnHeader column={column} title=""/>,
        cell: ({row}) => {
            const isDeleted = row.getValue("isDeleted") as boolean;
            if (!isDeleted) {
                return (
                    <Image
                        src="/check.png"
                        width={500}
                        height={500}
                        alt="Gallery Icon"
                        className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
                    />
                );
            }
            return (
                <Image
                    src="/uncheck.png"
                    width={500}
                    height={500}
                    alt="Gallery Icon"
                    className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
                />
            );
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        id: "actions",
        cell: ({row}) => {
            return <Actions row={row}/>;
        },
    },
];
