import axios from "axios";
import { Api_Host } from "./api";

const RegimenFiscal_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/regimenfiscal/'
})

export const getAllRegimenFiscal=()=> RegimenFiscal_Api.get('/');