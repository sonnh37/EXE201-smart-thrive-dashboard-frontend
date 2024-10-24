import {columns} from "./columns";

import {isDeleted_options, payment_order_options, status_order_options,} from "@/components/common/filters";
import orderService from "@/services/order-service";

import {formOrderFilterAdvancedSchema} from "@/schemas/order-schema";
import {formFilterAdvanceds} from "./filter-advanced-form";
import {FilterEnum} from "@/types/filter-enum";
import {DataTable} from "@/components/common/data-table-generic/data-table";

export default function DataTableOrders() {
    const filterEnums: FilterEnum[] = [
        {columnId: "status", title: "Status", options: status_order_options},
        {
            columnId: "paymentMethod",
            title: "Payment method",
            options: payment_order_options,
        },
        {columnId: "isDeleted", title: "Is deleted", options: isDeleted_options},
    ];

    return (
        <DataTable
            deleteData={orderService.delete}
            columns={columns}
            fetchData={orderService.fetchAll}
            columnSearch="description"
            filterEnums={filterEnums}
            formSchema={formOrderFilterAdvancedSchema}
            formFilterAdvanceds={formFilterAdvanceds}
        />
    );
}
