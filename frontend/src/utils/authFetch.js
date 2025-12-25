
import { logout } from "../auth/authSlice";
import { toast } from "react-toastify";

export const authFetch = async (url, options = {}, dispatch) => {

    const res = await fetch(url, options)
    if (res.status === 401) {
        toast.warning("Session Expired.Please Login agin !")
        dispatch(logout())
        window.location.href = "/login";
        throw new Error("unAuthorized")
    }
    return res

};
