import axios from "axios";

const ApiUrl = process.env.REACT_APP_API_KEY;
console.log("🚀 ~ ApiUrl:", ApiUrl);

const Api = axios.create({
  baseURL: ApiUrl,
});

export default Api;
