import { useToast } from "@/hooks/useToast";
import { SessionAuthentication } from "@/modules/auth/guards/SessisonAuthentication";
import axios from "axios";


export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
})

const toast = useToast();

api.interceptors.request.use(
    (config) => {
        const session = SessionAuthentication.getSession();
        const token = session?.token

        if (token) {
            config.headers = config.headers ?? {}
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)


api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response) {
            if (error.response.status === 500) {
                toast.error("Server Error (500)");
            }
        }
        else if (error.request) {
            toast.error("Server connection failed");
        }
        else {
            toast.error("Unexpected error occurred");
        }
        return Promise.reject(error);
    }
);
