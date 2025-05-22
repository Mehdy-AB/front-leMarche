import axios from "axios";

const axiosGhost = axios.create({
  baseURL:`https://back-le-marche.vercel.app`,
});

export default axiosGhost;