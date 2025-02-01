import axios from "axios";
import { Api_Host } from "./api";

const Cotizacion_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/cotizacion/'
})

export const getAllCotizacion=()=>Cotizacion_Api.get('/');

export const updateCotizacion=(id, data)=>Cotizacion_Api.put(`/${id}/`,data);

export const createCotizacion=(data)=>Cotizacion_Api.post('/',data);

export const getCotizacionById = async (id) => Cotizacion_Api.get(`/${id}/`);

