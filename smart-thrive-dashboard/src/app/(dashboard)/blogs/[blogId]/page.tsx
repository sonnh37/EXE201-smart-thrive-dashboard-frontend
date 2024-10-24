"use client";
import {Breadcrumbs} from "@/components/common/breadcrumb";
import {ContentLayout} from "@/components/common/content-layout";
import {BlogForm} from "@/components/sections/blogs/create-update-form";
import blogService from "@/services/blog-service";
import {Blog} from "@/types/blog";
import {useEffect, useState} from "react";
import {toast} from "sonner";

export default function Page({params}: { params: { blogId: string } }) {
    const [blog, setBlog] = useState<Blog | null>(null);

    // Fetch blog data when params.blogId changes
    useEffect(() => {
        const fetchData = async () => {
            const response = await blogService.fetchById(params.blogId);
            if (response.status !== 1) {
                return toast.error(response.message);
            }
            setBlog(response.data as Blog); // Assuming response.data contains the blog data
        };
        fetchData();
    }, [params.blogId]);

    const breadcrumbItems = [
        {title: 'Dashboard', link: '/'},
        {title: 'Blog', link: '/blogs'},
        {title: `${params.blogId}`, link: `/blogs/${params.blogId}`}
    ];

    return (
        <ContentLayout title="Service">
            <div className="space-y-6">
                <Breadcrumbs items={breadcrumbItems}/>
                <BlogForm initialData={blog}/>
            </div>
        </ContentLayout>
    );
}
