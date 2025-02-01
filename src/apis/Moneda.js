import axios from "axios";
import { Api_Host } from "./api";

const TipoMoneda_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/tipomoneda/'
})

export const getAllTipoMoneda=()=> TipoMoneda_Api.get('/');