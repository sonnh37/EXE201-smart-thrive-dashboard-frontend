import { cleanQueryParams } from "@/lib/clean-query-param";
import { Const } from "@/lib/const";
import { Package } from "@/types/package";
import { PackageGetAllQuery } from "@/types/request/package-query";
import { BusinessResult } from "@/types/response/business-result";
import axios from "axios";

const handleError = (error: any) => {
  console.error("API Package Error:", error);
  throw error;
};

export const fetchPackages = (
  query: PackageGetAllQuery
): Promise<BusinessResult<PagedResponse<Package>>> => {
  const cleanedQuery = cleanQueryParams(query);
  console.log("check_package_query", cleanedQuery.toString());

  return axios
    .get<BusinessResult<PagedResponse<Package>>>(
      `${Const.API_PACKAGE}?${cleanedQuery}`
    )
    .then((response) => {
      console.log("check_package_result", response.data);
      return response.data;
    })
    .catch(handleError);
};

export const fetchPackage = (id: string): Promise<BusinessResult<Package>> => {
  return axios
    .get<BusinessResult<Package>>(`${Const.API_PACKAGE}/${id}`)
    .then((response) => response.data)
    .catch(handleError);
};

export const deletePackage = (id: string): Promise<BusinessResult<null>> => {
  return axios
    .delete<BusinessResult<null>>(`${Const.API_PACKAGE}/${id}`)
    .then((response) => response.data)
    .catch(handleError);
};
