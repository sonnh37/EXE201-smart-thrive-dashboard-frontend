"use client";
import {Breadcrumbs} from "@/components/common/breadcrumb";
import {ContentLayout} from "@/components/common/content-layout";
import {CourseForm} from "@/components/sections/courses/create-update-form";
import {Course} from "@/types/course";
import {useEffect, useState} from "react";
import {toast} from "sonner";
import courseService from "@/services/course-service";

export default function Page({params}: { params: { courseId: string } }) {
    const [course, setCourse] = useState<Course | null>(null);

    // Fetch course data when params.courseId changes
    useEffect(() => {
        const fetchData = async () => {
            const response = await courseService.fetchById(params.courseId);
            if (response.status !== 1) {
                return toast.error(response.message);
            }
            setCourse(response.data as Course); // Assuming response.data contains the course data
        };
        fetchData();
    }, [params.courseId]);

    const breadcrumbItems = [
        {title: 'Dashboard', link: '/'},
        {title: 'Courses', link: '/courses'},
        {title: `${params.courseId}`, link: `/courses/${params.courseId}`}
    ];

    return (
        <ContentLayout title="Service">
            <div className="space-y-6">
                <Breadcrumbs items={breadcrumbItems}/>
                <CourseForm initialData={course}/>
            </div>
        </ContentLayout>
    );
}
