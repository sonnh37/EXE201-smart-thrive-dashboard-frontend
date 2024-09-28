import { columns } from "./columns";

import {
  isDeleted_options,
  payment_order_options,
  status_order_options,
} from "@/components/common/filters";
import { deleteOrder, fetchOrders } from "@/services/order-service";

import { DataTableGeneric } from "@/components/common/data-table-generic/data-table-generic";
import { formOrderFilterAdvancedSchema } from "@/schemas/order-schema";
import { formFilterAdvanceds } from "./filter-advanced-form";
import { FilterEnum } from "@/types/filter-enum";

export default function DataTableOrders() {
  const filterEnums: FilterEnum[] = [
    { columnId: "status", title: "Status", options: status_order_options },
    {
      columnId: "paymentMethod",
      title: "Payment method",
      options: payment_order_options,
    },
    { columnId: "isDeleted", title: "Is deleted", options: isDeleted_options },
  ];

  return (
    <DataTableGeneric
      deleteData={deleteOrder}
      columns={columns}
      fetchData={fetchOrders}
      columnSearch="description"
      filterEnums={filterEnums}
      formSchema={formOrderFilterAdvancedSchema}
      formFilterAdvanceds={formFilterAdvanceds}
    />
  );
}
