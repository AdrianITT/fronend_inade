import axios from "axios";
import { Api_Host } from "./api";

const OrdenesTrabajoServico_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/ordentrabajoservicio/'
})

export const getAllOrdenesTrabajoServicio=()=>OrdenesTrabajoServico_Api.get('/');

export const createOrdenTrabajoServico=(data)=>OrdenesTrabajoServico_Api.post('/',data);

export const getOrdenTrabajoServiciosByOrden=(id)=>OrdenesTrabajoServico_Api.get(`/${id}/`);