import axios from "axios";
import { Api_Host } from "./api";

const Receptor_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/receptor/'
})

export const getAllReceptor=()=>Receptor_Api.get('/');

export const updateReceptor=(id,data)=>Receptor_Api.punt(`/${id}/`,data);

export const createReceptor= async (data)=> {
try{
     const response = await Receptor_Api.post('/',data)
     return response.data;
}catch(error){
     console.error("Error al crear sreceptor:", error);
     throw error;
}
}

export const getReceptorByI = async (id) => Receptor_Api.get(`/${id}/`);