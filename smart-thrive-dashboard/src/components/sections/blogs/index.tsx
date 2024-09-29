import { columns } from "./columns";

import {
  isActive_options,
  isDeleted_options,
} from "@/components/common/filters";
import { deleteBlog, fetchBlogs } from "@/services/blog-service";

import { formBlogFilterAdvancedSchema } from "@/schemas/blog-schema";
import { formFilterAdvanceds } from "./filter-advanced-form";
import { FilterEnum } from "@/types/filter-enum";
import { DataTable } from "@/components/common/data-table-generic/data-table";

export default function DataTableBlogs() {
  const filterEnums: FilterEnum[] = [
    {
      columnId: "isActive",
      title: "Is Active",
      options: isActive_options,
    },
    { columnId: "isDeleted", title: "Is deleted", options: isDeleted_options },
  ];

  return (
    <DataTable
      deleteData={deleteBlog}
      columns={columns}
      fetchData={fetchBlogs}
      columnSearch="title"
      filterEnums={filterEnums}
      formSchema={formBlogFilterAdvancedSchema}
      formFilterAdvanceds={formFilterAdvanceds}
    />
  );
}
