import axiosInstance from "@/lib/axios-instance";
import {cleanQueryParams} from "@/lib/clean-query-param";
import {Const} from "@/lib/const";
import {Blog} from "@/types/blog";
import {BlogCreateCommand, BlogUpdateCommand,} from "@/types/commands/blog-command";
import {BlogGetAllQuery} from "@/types/queries/blog-query";
import {BusinessResult} from "@/types/response/business-result";

const handleError = (error: any) => {
    console.error("API Blog Error:", error);
    throw error;
};

export const fetchBlogs = (
    query: BlogGetAllQuery
): Promise<BusinessResult<PagedResponse<Blog>>> => {
    const cleanedQuery = cleanQueryParams(query);
    console.log("check_service_blog_query", cleanedQuery.toString());

    return axiosInstance
        .get<BusinessResult<PagedResponse<Blog>>>(
            `${Const.API_BLOG}?${cleanedQuery}`
        )
        .then((response) => {
            console.log("check_result", response.data);
            return response.data;
        })
        .catch(handleError);
};

export const fetchBlog = (id: string): Promise<BusinessResult<Blog>> => {
    return axiosInstance
        .get<BusinessResult<Blog>>(`${Const.API_BLOG}/${id}`)
        .then((response) => response.data)
        .catch(handleError);
};

export const createBlog = (
    command: BlogCreateCommand
): Promise<BusinessResult<Blog>> => {
    return axiosInstance
        .post<BusinessResult<Blog>>(`${Const.API_BLOG}`, command)
        .then((response) => response.data)
        .catch(handleError);
};

export const updateBlog = (
    command: BlogUpdateCommand
): Promise<BusinessResult<Blog>> => {
    return axiosInstance
        .put<BusinessResult<Blog>>(`${Const.API_BLOG}`, command)
        .then((response) => response.data)
        .catch(handleError);
};

export const deleteBlog = (id: string): Promise<BusinessResult<null>> => {
    return axiosInstance
        .delete<BusinessResult<null>>(`${Const.API_BLOG}/${id}`)
        .then((response) => response.data)
        .catch(handleError);
};
