import axios from "axios";

axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
axios.defaults.headers.common["Access-Control-Allow-Methods"] = "*";
axios.defaults.headers.common["Access-Control-Allow-Headers"] = "*";

export default axios;
