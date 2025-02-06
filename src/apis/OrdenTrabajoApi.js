import axios from "axios";
import { Api_Host } from "./api";

const OrdenesTrabajo_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/ordentrabajo/'
})

export const getAllOrdenesTrabajo=()=>OrdenesTrabajo_Api.get('/');

export const createOrdenTrabajo=(data)=>OrdenesTrabajo_Api.post('/',data);

export const getOrdenTrabajoById = (id) => OrdenesTrabajo_Api.get(`/${id}/`);

export const PDFOrdenTrabajo=(id)=>OrdenesTrabajo_Api.get(`/${id}/pdf`);