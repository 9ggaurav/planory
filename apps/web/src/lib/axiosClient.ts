import axios from "axios";

const api = axios.create({
    // baseURL: process.env.API_BASE_URL,
    baseURL: "http://localhost:3000/api/v1",
    withCredentials: true,
})

export default api;