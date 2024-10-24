"use client";

import {Breadcrumbs} from "@/components/common/breadcrumb";
import {ContentLayout} from "@/components/common/content-layout";
import dynamic from "next/dynamic";

const BlogForm = dynamic(() => import("@/components/sections/blogs/create-update-form").then((mod) => mod.BlogForm), {
    ssr: false
});
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
                <BlogForm initialData={null}/>
            </div>
        </ContentLayout>
    );
}
