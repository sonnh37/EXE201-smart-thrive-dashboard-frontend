"use client";
import { Breadcrumbs } from "@/components/common/breadcrumb";
import {ContentLayout} from "@/components/common/content-layout";
import DataTableBlogs from "@/components/sections/blogs";

const breadcrumbItems = [
    {title: "Dashboard", link: "/"},
    {title: "Blogs", link: "/blogs"},
];
export default function Page() {
    return (
        <ContentLayout title="Courses">
            <div className="space-y-6">
                <Breadcrumbs items={breadcrumbItems}/>
                <DataTableBlogs/>
            </div>
        </ContentLayout>
    );
}
