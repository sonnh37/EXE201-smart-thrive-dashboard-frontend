"use client";

import {ContentLayout} from "@/components/common/content-layout";
import {HomeDashboard} from "@/components/sections/home-dashboard";
import {Breadcrumbs} from "@/components/common/breadcrumb";

const breadcrumbItems = [{title: "Dashboard", link: "/"}];

export default function HomePage() {
    return (
        <ContentLayout title="Dashboard">
            <Breadcrumbs items={breadcrumbItems}/>
            <HomeDashboard/>
        </ContentLayout>
    );
}
