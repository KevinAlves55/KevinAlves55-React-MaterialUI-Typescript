import axios from "axios";
import { errorInterceptor, responseInterceptor } from "./interceptors";

import { Environment } from "../../../environments";

export const Api = axios.create({

    baseURL: Environment.URL_BASE

});

Api.interceptors.response.use(

    (response) => responseInterceptor(response),
    (error) => errorInterceptor(error),

);