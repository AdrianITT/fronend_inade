import axios from "axios";
import { Api_Host } from "./api";


const User_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/user/'
})

export const getAllUser=()=>User_Api.get('/');

export const updateUser=(id,data)=>User_Api.punt(`/${id}/`,data);

export const createUser =(data)=>User_Api.post('/',data);

export const deleteUser=(id)=>User_Api.delete(`/${id}/`);