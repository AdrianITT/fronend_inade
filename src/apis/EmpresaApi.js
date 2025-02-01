import axios from "axios";
import { Api_Host } from "./api";

const Empresa_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/empresa/'
})

export const getAllEmpresas=()=> Empresa_Api.get('/');

export const createEmpresas = async (data) => {
     try {
       const response = await Empresa_Api.post('/', data);
       return response; // Devuelve la respuesta de la API para que pueda ser utilizada en el componente
     } catch (error) {
       console.error("Error al crear la empresa:", error.response ? error.response.data : error.message);
       throw error; // Lanza el error para que pueda ser manejado en el componente
     }
   };

export const deleteEmpresa=(id) => Empresa_Api.delete(`/${id}/`);

export const updateEmpresa= (id, data) => Empresa_Api.put(`/${id}/`, data);

export const getEmpresaById = (id) => Empresa_Api.get(`/${id}/`); // Para obtener los datos de la empresa