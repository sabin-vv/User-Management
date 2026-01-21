
import { logout, setAccessToken } from "../auth/adminAuthSlice";
import { toast } from "react-toastify";

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const adminAuthFetch = async (url, options = {}, dispatch) => {
    if (!options.headers) {
        options.headers = {};
    }
    options.credentials = 'include';

    const res = await fetch(url, options);

    if (res.status === 401) {
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(token => {
                const retryOptions = { ...options };
                if (!retryOptions.headers) {
                    retryOptions.headers = {};
                }
                retryOptions.headers.Authorization = `Bearer ${token}`;
                retryOptions.credentials = 'include';
                return fetch(url, retryOptions);
            }).catch(err => {
                throw err;
            });
        }

        isRefreshing = true;

        try {
            const refreshRes = await fetch("http://localhost:5000/api/auth/refresh", {
                method: "POST",
                credentials: 'include'
            });

            if (!refreshRes.ok) {
                throw new Error("Refresh failed");
            }

            const data = await refreshRes.json();
            dispatch(setAccessToken({ accessToken: data.accessToken, admin: data.user }));

            processQueue(null, data.accessToken);
            isRefreshing = false;

            const retryOptions = { ...options };
            if (!retryOptions.headers) {
                retryOptions.headers = {};
            }
            retryOptions.headers.Authorization = `Bearer ${data.accessToken}`;
            retryOptions.credentials = 'include';
            return fetch(url, retryOptions);

        } catch (err) {
            processQueue(err, null);
            isRefreshing = false;

            toast.warning("Session Expired. Please Login again!");
            dispatch(logout());

            window.location.href = "/admin/login";

            throw new Error("Unauthorized");
        }
    }

    return res;
};

