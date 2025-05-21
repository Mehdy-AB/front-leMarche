import axios from "axios";

const axiosGhost = axios.create({
  baseURL: 'http://localhost:8000',
});

export default axiosGhost;