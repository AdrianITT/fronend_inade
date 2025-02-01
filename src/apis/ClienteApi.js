import axios from "axios";
import { Api_Host } from "./api";


const Cliente_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/cliente/'
})

export const getAllCliente=()=> Cliente_Api.get('/');

export const createCliente=(data)=> Cliente_Api.post('/', data);

export const deleteCliente =(id)=>Cliente_Api.delete(`/${id}/`);

export const updateCliente = async (id, data) => Cliente_Api.put(`/${id}/`,data)

export const getClienteById = async (id) => Cliente_Api.get(`/${id}/`);


