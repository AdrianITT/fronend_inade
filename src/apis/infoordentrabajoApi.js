import axios from "axios";
import { Api_Host } from "./api";



const InfoOrdenTrabajo_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/infoordentrabajo/',
});

export const getAllInfoOrdenTrabajo=()=>InfoOrdenTrabajo_Api.get('/');

export const updateInfoOrdenTrabajo=(id,data)=>InfoOrdenTrabajo_Api.put(`/${id}/`,data);

export const getInfoOrdenTrabajoById = async (id) => InfoOrdenTrabajo_Api.get(`/${id}/`);

export const crearInfoOrdenTrabajo =(data)=> InfoOrdenTrabajo_Api.post('/', data);