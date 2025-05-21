import axios from "axios";

const axiosGhost = axios.create({
  baseURL: process.env.Backend_URL,
});

export default axiosGhost;