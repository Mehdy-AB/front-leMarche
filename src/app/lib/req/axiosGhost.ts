import axios from "axios";

const axiosGhost = axios.create({
  baseURL: "/api",
});

export default axiosGhost;