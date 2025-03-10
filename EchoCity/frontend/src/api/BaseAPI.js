import axios from 'axios';

const BASE_URL = import.meta.env.VITE_PRODUCTION_BASE_URL || "http://localhost:3001";

class BaseAPI {

    static token;

    static async request({ endpoint, data = {}, method = "get" }){
        const url = `${BASE_URL}/${endpoint}`;
        const params = (method === 'get') ? data : {};
        const headers = {};

        if(this.token){
            headers.Authorization = `Bearer ${this.token}`
        };

        try{
            const axiosRes = await axios({ url, method, data, params, headers, withCredentials: true });
            return axiosRes.data;
        } catch(err){
            console.error("API Error", err.response);
            throw err;
            // let message = err?.response?.data?.error?.message || err.message;
            // throw new Error(message);
        }
    }

}

export default BaseAPI;