import {
  createApi,
  fetchBaseQuery,
  FetchArgs,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import Cookies from "js-cookie";

const baseQuery = fetchBaseQuery({
  baseUrl: `https://api.bitechx.com/products`,
  prepareHeaders: (headers) => {
    const token = Cookies.get("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  string | FetchArgs,
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions); // Changed 'let' to 'const'

  if (result?.error?.status === 404) {
    toast.error(
      (result.error.data as { message: string })?.message || "Not Found"
    );
  }
  if (result?.error?.status === 403) {
    toast.error(
      (result.error.data as { message: string })?.message || "Forbidden"
    );
  }
  if (result?.error?.status === 409) {
    toast.error(
      (result.error.data as { message: string })?.message || "Conflict"
    );
  }
  if (result?.error?.status === 401) {
    console.log(result.error)
    // window.location.href = "/login";
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: ["company", "MyJob", "SavedJobs", "MYprofile","blog"],
  endpoints: () => ({}),
});
