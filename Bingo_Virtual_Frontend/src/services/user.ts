import axios from "./axios"


const API = 'http://localhost:5000/api/user'

export const registerRequest = user => axios.post(`${API}/signup`, user)

export const loginRequest = user => axios.post(`${API}/login`, user)

export const verifyTokenRequest = () => axios.post(`${API}/verify`)