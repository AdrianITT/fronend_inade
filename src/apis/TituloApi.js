import axios from "axios";
import { Api_Host } from "./api";

const Titulo_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/titulo/'
})

export const getAllTitulo=()=> Titulo_Api.get('/');