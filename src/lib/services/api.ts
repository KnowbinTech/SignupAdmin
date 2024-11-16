import axios from "axios";


let onRejected = function (error) {
    return Promise.reject(error);
};


function createAxiosInstance() {
    
    const axiosInstance = axios.create({
        baseURL: '/api',
        withCredentials: true,
        xsrfHeaderName: 'X-CSRFToken', // Verify this matches the CSRF token header name used in your backend
        xsrfCookieName: 'csrftoken',   // Verify this matches the CSRF token cookie name used in your backend
        headers: {
            Accept: "application/json"
        }
    });

    axiosInstance.interceptors.request.use(
        function (request) {
            const method = request.method;
            const token = sessionStorage.getItem('authToken');
            if (token) {
                request.headers['authorization'] = `Bearer ${token}`;
            }

            if (method !== "get" && method !== "delete") {
                if (typeof FormData !== "undefined" && request.data instanceof FormData) {
                    request.headers["Content-Type"] = "multipart/form-data";
                }
            }

            if (method == "get" || method == "delete") {
                request.params = {
                    ...request.params,
                    ...request.data
                }
            }
            return request;
        }
    )

    axiosInstance.interceptors.response.use(function (response) {
        return response;
    }, onRejected)

    return axiosInstance
}

const api = createAxiosInstance();

export default api;
