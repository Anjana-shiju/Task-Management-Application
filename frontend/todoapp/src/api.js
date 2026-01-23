// import axios from "axios";

// const API = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE_URL,
//   withCredentials: true,
// });

// // 🔐 Attach token automatically
// API.interceptors.request.use(
//   (req) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       req.headers.Authorization = `Bearer ${token}`;
//     }
//     return req;
//   },
//   (error) => Promise.reject(error)
// );

// // ⚠️ Handle unauthorized globally
// API.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       localStorage.clear();
//       window.location.href = "/login";
//     }
//     return Promise.reject(err);
//   }
// );

// export default API;




import axios from "axios";

const API = axios.create({
  // നിന്റെ ലൈവ് ബാക്കെൻഡ് URL ഇവിടെ നൽകുന്നു
  baseURL: "https://task-management-application-s4gl.onrender.com/api", 
  withCredentials: true,
});

// 🔐 ടോക്കൺ ഓട്ടോമാറ്റിക് ആയി അയക്കാൻ
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// ⚠️ ലോഗിൻ എക്സ്പയർ ആയാൽ ഹാൻഡിൽ ചെയ്യാൻ
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
