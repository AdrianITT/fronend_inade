import axios from "axios";
import { Api_Host } from "./api";



const PDF_Api= axios.create({
     baseURL: Api_Host.defaults.baseURL+'/cotizacion/',
});

export const PDFCotizacion = async (id)=>{
     try{
      const response = PDF_Api.get(`/${id}/pdf`);  
      return response.data;  
     }catch(error){
          console.error("Error al obtener el PDF de la cotización:", error);
          throw error;
     }
     
}