import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"

//custom Zustand hook you can use in any React component to access or update auth-related state
export const useAuthStore = create((set) => ({
    authUser: null, // holds the currently logged-in user’s data
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,  //boolean flag indicating whether the app is still checking if the user is authenticated

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        }
        catch (error) {
            console.log("Error in checkAuth: ", error);
            set({ authUser: null });
        }
        finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) =>{
        set({isSigningUp: true});
        try{
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data});
            toast.success("Account created successfully");
        }
        catch(error){
            toast.error(error.response.data.message);
        }
        finally{
            set({isSigningUp: false});
        }
    },

    logout: async () =>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser: null});
            toast.success("Logged out Successfully");
        }
        catch(error){
            toast.error(error.response.data.message);
        }
    },

    login: async (data) =>{
        set({isLoggingIn: true});
        try{
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data});
            toast.success("Logged In successfully");
        }
        catch(error){
            toast.error(error.response.data.message);
        }
        finally{
            set({isLoggingIn: false});
        }
    }
}))