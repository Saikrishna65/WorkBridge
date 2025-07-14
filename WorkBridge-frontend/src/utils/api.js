import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api", // change to your backend URL if deployed
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
