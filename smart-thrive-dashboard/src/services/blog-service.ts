import { cleanQueryParams } from "@/lib/clean-query-param";
import { Const } from "@/lib/const";
import { Blog } from "@/types/blog";
import { BlogGetAllQuery } from "@/types/request/blog-query";
import { BusinessResult } from "@/types/response/business-result";
import axios from "axios";

const handleError = (error: any) => {
  console.error("API Blog Error:", error);
  throw error;
};

export const fetchBlogs = (
  query: BlogGetAllQuery
): Promise<BusinessResult<PagedResponse<Blog>>> => {
  const cleanedQuery = cleanQueryParams(query);
  console.log("check_service_blog_query", cleanedQuery.toString());

  return axios
    .get<BusinessResult<PagedResponse<Blog>>>(`${Const.API_BLOG}?${cleanedQuery}`)
    .then((response) => {
      console.log("check_result", response.data)
      return response.data
    })
    .catch(handleError);
};

export const fetchBlog = (id: string): Promise<BusinessResult<Blog>> => {
  return axios
    .get<BusinessResult<Blog>>(`${Const.API_BLOG}/${id}`)
    .then((response) => response.data)
    .catch(handleError);
};

export const deleteBlog = (id: string): Promise<BusinessResult<null>> => {
  return axios
    .delete<BusinessResult<null>>(`${Const.API_BLOG}/${id}`)
    .then((response) => response.data)
    .catch(handleError);
};
