import axios from "axios";
import { Api_Host } from "./api";


const ObjectImpuesto_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/objetoimpuesto/',
});

export const getAllObjectImpuesto_Api=()=>ObjectImpuesto_Api.get('/');