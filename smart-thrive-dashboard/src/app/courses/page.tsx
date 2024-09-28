"use client";
import {ContentLayout} from "@/components/common/content-layout";
import {Breadcrumbs} from "@/components/common/breadcrumb";
import DataTableCourses from "@/components/sections/courses";

const breadcrumbItems = [
    {title: "Dashboard", link: "/"},
    {title: "Courses", link: "/courses"},
];
export default function Page() {
    return (
        <ContentLayout title="Courses">
            <div className="space-y-6">
                <Breadcrumbs items={breadcrumbItems}/>
                <DataTableCourses/>
            </div>
        </ContentLayout>
    );
}
