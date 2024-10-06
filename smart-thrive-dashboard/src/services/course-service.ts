import axiosInstance from "@/lib/axios-instance";
import { cleanQueryParams } from "@/lib/clean-query-param";
import { Const } from "@/lib/const";
import { Course } from "@/types/course";
import { CourseGetAllQuery } from "@/types/queries/course-query";
import { BusinessResult } from "@/types/response/business-result";
import axios from "axios";

const handleError = (error: any) => {
  console.error("API Course Error:", error);
  throw error;
};

export const fetchCourses = (
  query: CourseGetAllQuery
): Promise<BusinessResult<PagedResponse<Course>>> => {
  const cleanedQuery = cleanQueryParams(query);
  console.log("check_service_course_query", cleanedQuery.toString());

  return axiosInstance
    .get<BusinessResult<PagedResponse<Course>>>(`${Const.API_COURSE}?${cleanedQuery}`)
    .then((response) => {
      console.log("check_result", response.data)
      return response.data
    })
    .catch(handleError);
};

export const fetchCourse = (id: string): Promise<BusinessResult<Course>> => {
  return axiosInstance
    .get<BusinessResult<Course>>(`${Const.API_COURSE}/${id}`)
    .then((response) => response.data)
    .catch(handleError);
};

export const deleteCourse = (id: string): Promise<BusinessResult<null>> => {
  return axiosInstance
    .delete<BusinessResult<null>>(`${Const.API_COURSE}/${id}`)
    .then((response) => response.data)
    .catch(handleError);
};
