import axios from "axios";
import { Api_Host } from "./api";


const Metodo_Api= axios.create({
    baseURL: Api_Host.defaults.baseURL+'/metodos/'
})

export const getAllMetodo=()=> Metodo_Api.get('/');


export const createMetodo= async (data)=>{
     try{
          const response = await Metodo_Api.post('/',data);
          return response.data;
     }catch(error){
          console.error("Error al crear METODO:", error);
          throw error;
     }
}

export const deleteMetodo= async (id)=>{
    try{
         const response = await Metodo_Api.delete(`/${id}/`);
         return response.data;
    }catch(error){
         console.error("Error al eliminar Metodo:", error);
         throw error;
    }
}

export const getMetodoById = (id) => Metodo_Api.get(`/${id}/`);