import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import axios from "axios";
import { HttpMethod, HttpRequestConfig, HttpRequestConfigProps } from "@/types/http";
import appConfig from "@/lib/config";
import { getAuthToken } from "@/lib/utils/auth";
import { clearAllData } from "@/lib/utils/clearAllData";

export const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const sendHttpRequest = useCallback(
    async ({ successRes, errorRes, requestConfig }: HttpRequestConfigProps) => {
      setError(null);
      setIsLoading(true);

      try {
        const baseURL = requestConfig.baseURL || appConfig.api.baseURL;
        const token = getAuthToken();

        const headers: any = {
          "Content-Type": requestConfig.contentType || "application/json",
        };

        if (requestConfig.isAuth && token) {
          headers["Authorization"] = `Bearer ${token}`;
          console.log('[useHttp] Adding Authorization header with token');
        }

        const config = {
          baseURL,
          url: requestConfig.url,
          method: requestConfig.method,
          headers,
          ...(requestConfig.params && { params: requestConfig.params }),
          ...(requestConfig.body && { data: requestConfig.body }),
        };

        const res = await axios.request(config);

        console.log('[useHttp] Response status:', res.status);
        console.log('[useHttp] Response data:', res.data);

        if (res.status >= 200 && res.status < 300) {
          if (requestConfig.successMessage) {
            console.log(requestConfig.successMessage);
          }

          if (successRes) {
            console.log('[useHttp] Calling successRes with:', res.data.data || res.data);
            successRes(res.data.data || res.data);
          }
        }
      } catch (error: any) {
        console.log('[useHttp] Error caught:', error.response?.status, error.response?.data);

        // Check if custom error handler is provided and should be used
        if (errorRes && error?.response) {
          console.log('[useHttp] Calling custom errorRes handler');
          const shouldUseCustomHandler = errorRes(error.response);
          console.log('[useHttp] Custom handler returned:', shouldUseCustomHandler);
          if (shouldUseCustomHandler === false) {
            // Custom handler processed the error, don't show default message
            console.log('[useHttp] Custom handler processed error, skipping default message');
            setError(null);
            setIsLoading(false);
            return;
          }
        }

        let errorMessage = "Something went wrong!";

        if (error.code === "ERR_NETWORK") {
          errorMessage =
            "Network error. Please check your internet connection.";
        } else if (error.code === "ECONNABORTED") {
          errorMessage = "Request timed out. Please try again.";
        } else if (error?.response?.data?.description) {
          errorMessage = error?.response?.data?.description;
        } else if (error?.response?.data?.message) {
          errorMessage = error?.response?.data?.message;
        }

        const isAuthEndpoint =
          error.config?.url?.includes("auth") ||
          error.config?.url?.includes("login");

        if (error.response?.status === 401 && !isAuthEndpoint) {
          errorMessage = "Session expired!";

          // Clear ALL auth data: localStorage, sessionStorage, and all future data
          clearAllData();

          if (pathname) {
            sessionStorage.setItem("redirectAfterLogin", pathname);
          }

          router.replace("/auth/login");
        }

        console.log('[useHttp] Final error message:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [router, pathname]
  );

  return {
    isLoading,
    sendHttpRequest,
    error,
  };
};

