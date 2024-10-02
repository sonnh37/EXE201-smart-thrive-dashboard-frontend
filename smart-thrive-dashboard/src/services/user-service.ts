import { cleanQueryParams } from "@/lib/clean-query-param";
import { Const } from "@/lib/const";
import { User } from "@/types/user";
import { UserGetAllQuery } from "@/types/request/user-query";
import { BusinessResult } from "@/types/response/business-result";
import axios from "axios";

const handleError = (error: any) => {
  console.error("API User Error:", error);
  throw error;
};

export const fetchUsers = (
  query: UserGetAllQuery
): Promise<BusinessResult<PagedResponse<User>>> => {
  const cleanedQuery = cleanQueryParams(query);
  console.log("check_service_user_query", cleanedQuery.toString());

  return axios
    .get<BusinessResult<PagedResponse<User>>>(`${Const.API_ORDER}?${cleanedQuery}`)
    .then((response) => {
      console.log("check_result", response.data)
      return response.data
    })
    .catch(handleError);
};

export const fetchUser = (id: string): Promise<BusinessResult<User>> => {
  return axios
    .get<BusinessResult<User>>(`${Const.API_ORDER}/${id}`)
    .then((response) => response.data)
    .catch(handleError);
};

export const deleteUser = (id: string): Promise<BusinessResult<null>> => {
  return axios
    .delete<BusinessResult<null>>(`${Const.API_ORDER}/${id}`)
    .then((response) => response.data)
    .catch(handleError);
};
