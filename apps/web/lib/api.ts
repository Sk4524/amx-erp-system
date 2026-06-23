import axios from "axios";
import toast from "react-hot-toast";
import {
  getToken,
  getTenantId,
  logout,
} from "./session";

const api = axios.create({
  baseURL:
  process.env
    .NEXT_PUBLIC_API_URL
});

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {

  if (typeof window !== "undefined") {

   const token =
  getToken();

const tenantId =
  getTenantId();

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    if (tenantId) {

      config.headers["x-tenant-id"] =
  tenantId;
    }
  }

  return config;
});
// RESPONSE INTERCEPTOR
api.interceptors.response.use(

  (response) => response,

  (error) => {

    if (
      typeof window !== "undefined"
    ) {

      const status =
        error?.response?.status;

      // UNAUTHORIZED
      if (status === 401) {

        logout();
      }

      // FORBIDDEN
        if (status === 403) {

        toast.error(
          "Access Denied"
        );

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
export default api;