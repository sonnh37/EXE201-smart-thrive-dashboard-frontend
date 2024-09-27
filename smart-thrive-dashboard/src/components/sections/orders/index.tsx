import { columns } from "./columns";

import {
  isDeleted_options,
  status_order_options,
} from "@/components/common/filters";
import { fetchOrders } from "@/services/order-service";

import { DataTableGeneric } from "@/components/common/data-table-generic/data-table-generic";
import { formOrderSchema } from "@/schemas/order-schema";
import { formFilterAdvanceds } from "./filter-advanced-form";
import { FilterEnum } from "@/types/filter-enum";

export default function DataTableOrders() {
  const filterEnums: FilterEnum[] = [
    { columnId: "isDeleted", title: "Is deleted", options: isDeleted_options },
    { columnId: "status", title: "Status", options: status_order_options },
  ];

  return (
    <DataTableGeneric
      columns={columns}
      fetchData={fetchOrders}
      columnSearch="description"
      filterEnums={filterEnums}
      formSchema={formOrderSchema}
      formFilterAdvanceds={formFilterAdvanceds}
    />
  );
}
