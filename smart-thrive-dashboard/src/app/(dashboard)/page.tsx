"use client";

import {ContentLayout} from "@/components/common/content-layout";
import {Breadcrumbs} from "@/components/common/breadcrumb";
import {Dashboard} from "@/components/sections/home/dashboard";

const breadcrumbItems = [{title: "Home", link: "/"}];

export default function HomePage() {
    return (
        <ContentLayout title="Home">
            <Breadcrumbs items={breadcrumbItems}/>
            <Dashboard/>
        </ContentLayout>
    );
}
