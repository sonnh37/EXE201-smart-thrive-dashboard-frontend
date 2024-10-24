"use client";

import {DataTableColumnHeader} from "@/components/common/data-table-generic/data-table-column-header";
import {Badge} from "@/components/ui/badge";
import {Checkbox} from "@/components/ui/checkbox";
import {Package} from "@/types/package";
import {ColumnDef} from "@tanstack/react-table";
import Actions from "./actions";
import Image from "next/image";
import {PackageStatus} from "@/types/enums/package";

export const columns: ColumnDef<Package>[] = [
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
        accessorKey: "name",
        header: ({column}) => <DataTableColumnHeader column={column} title="Title"/>,
    },
    {
        accessorKey: "quantityCourse",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Quantity Course"/>
        ),
        cell: ({row}) => {
            const amount = parseFloat(row.getValue("quantityCourse"));

            return <div className="font-medium">{amount}</div>;
        },
    },
    {
        accessorKey: "totalPrice",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Total Price"/>
        ),
        cell: ({row}) => {
            const amount = parseFloat(row.getValue("totalPrice"));

            const formatted = new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(amount);

            return <div className="font-medium">{formatted}</div>;
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
        accessorKey: "status",
        header: ({column}) => (
            <DataTableColumnHeader column={column} title="Status"/>
        ),
        cell: ({row}) => {
            const status = row.getValue("status") as PackageStatus;
            const statusText = PackageStatus[status];

            let badgeVariant:
                | "secondary"
                | "destructive"
                | "default"
                | "outline"
                | null = "default";

            switch (status) {
                case PackageStatus.Pending:
                    badgeVariant = "secondary";
                    break;
                case PackageStatus.Approved:
                    badgeVariant = "default";
                    break;
                case PackageStatus.Rejected:
                    badgeVariant = "destructive";
                    break;
                default:
                    badgeVariant = "default";
            }

            return <Badge variant={badgeVariant}>{statusText}</Badge>;
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
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
                        src="https://firebasestorage.googleapis.com/v0/b/smart-thrive.appspot.com/o/Blog%2Fcheck.png?alt=media&token=1bdb7751-4bdc-4af1-b6e1-9b758df3a3d5"
                        width={500}
                        height={500}
                        alt="Gallery Icon"
                        className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"
                    />
                );
            }
            return (
                <Image
                    src="https://firebasestorage.googleapis.com/v0/b/smart-thrive.appspot.com/o/Blog%2Funcheck.png?alt=media&token=3b2b94d3-1c59-4a96-b4c6-312033d868b1"
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
