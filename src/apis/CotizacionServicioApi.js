import axios from "axios";
import { Api_Host } from "./api";


const CotizacionServicio_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/cotizacionservicio/'
})

export const getAllCotizacionServicio=()=>CotizacionServicio_Api.get('/');

export const createCotizacionServicio=(data)=>CotizacionServicio_Api.post('/',data);

export const getCotizacionServiciosByCotizacion =(data)=>CotizacionServicio_Api.get('/',data)