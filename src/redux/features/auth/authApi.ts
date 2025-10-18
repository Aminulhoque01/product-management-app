import { baseApi } from "../api/baseApi";

type LoginRequest = { email: string; password: string };


const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginData: LoginRequest) => ({
        url: "/auth/login",
        method: "POST",
        body: loginData,
      }),
    }),
   
    
  }),
});

export const {
  useLoginMutation,
 
} = authApi;
