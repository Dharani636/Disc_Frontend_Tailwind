import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://localhost:8080",
});

export default publicApi;
