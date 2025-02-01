import axios from "axios";
import { Api_Host } from "./api";


const Organizacion_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/organizacion/',
});

export const getAllOrganizacion=()=>Organizacion_Api.get('/');

export const updateOrganizacion=(id,data)=>Organizacion_Api.punt(`/${id}/`,data);