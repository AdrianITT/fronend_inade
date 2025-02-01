import axios from "axios";
import { Api_Host } from "./api";


const Servicio_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/servicio/',
});

export const getAllServicio=()=>Servicio_Api.get('/');

export const deleteServicio=(id)=>Servicio_Api.delete(`/${id}/`);

export const createServicio= async (data)=>{
     try{
          const response = await Servicio_Api.post('/',data);
          return response.data;
     }catch(error){
          console.error("Error al crear servicio:", error);
          throw error;
     }
}

export const updateServicio = async (id, data) => {
          try{
          const response = await Servicio_Api.put(`/${id}/`,data)
          return response.data;  
          }catch(error){
               console.error("Error al actualizar servicio:", error);
               throw error;
          }
     }

export const getServicioById = async (id) => Servicio_Api.get(`/${id}/`);