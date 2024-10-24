"use client";

import {Breadcrumbs} from "@/components/common/breadcrumb";
import {ContentLayout} from "@/components/common/content-layout";
import {CourseForm} from "@/components/sections/courses/create-update-form";

const breadcrumbItems = [
    {title: "Dashboard", link: "/"},
    {title: "Blog", link: "/blogs"},
    {title: "New", link: "/blogs/new"},
];

export default function Page() {
    return (
        <ContentLayout title="Album">
            <div className="space-y-6">
                <Breadcrumbs items={breadcrumbItems}/>
                <CourseForm initialData={null}/>
            </div>
        </ContentLayout>
    );
}
