import axios from "axios";


const intance = axios.create({
    withCredentials: true,
});

export default intance;