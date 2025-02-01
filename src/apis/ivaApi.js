import axios from "axios";
import { Api_Host } from "./api";

const Iva_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/iva/'
})

export const getAllIva=()=>Iva_Api.get('/');