import axios from "axios";
import { Api_Host } from "./api";


const Estado_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/estado/'
})

export const getEstadoById =async (id)=> Estado_Api.get(`/${id}/`);