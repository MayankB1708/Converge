import axios from "axios";
//a popular HTTP client for making API requests


export const axiosInstance = axios.create({
    baseURL: "http://localhost:5001/api",
    withCredentials: true,  //tells the browser to include cookies 
});