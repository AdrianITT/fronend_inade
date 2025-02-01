import axios from "axios";
import { Api_Host } from "./api";


const UnidadCDFI_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/unidadcfdi/',
});

export const getAllUnidadCDFI=()=>UnidadCDFI_Api.get('/');