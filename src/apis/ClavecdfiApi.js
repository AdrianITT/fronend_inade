import axios from "axios";
import { Api_Host } from "./api";


const ClaveCDFI_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/clavecdfi/',
});

export const getAllClaveCDFI=()=>ClaveCDFI_Api.get('/');