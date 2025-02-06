import axios from "axios";
import { Api_Host } from "./api";



const marcaDeAgua_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/imagenmarcaagua/',
});

export const updateMacaAgua=(id,data)=>marcaDeAgua_Api.punt(`/${id}/`,data);

export const createMaraAgua=(data)=> marcaDeAgua_Api.post('/', data);