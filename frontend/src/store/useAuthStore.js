import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"

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
    }
}))