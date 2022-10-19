import React from 'react';
import "./ArchivoTarea.css";
import moment from "moment";
import { LinkOutlined } from '@ant-design/icons';
import returnExtIcon from '../../utils/ReturnExtIcon';

const ArchivoTarea = ({ archivo, interno=false, display=true}) => {
    const fechaArchivoHandler = (fecha) => {
        let fechaFormato = fecha.split("T");
        fechaFormato = fechaFormato[0];
        fechaFormato = moment(fechaFormato, "YYYY-MM-DD").fromNow();
        return fechaFormato;
      }
    
      const formatSize = (size) => {
        const sizeFile = Number(size);
        //
        let template;
        if (size >= 1024) {
          return (template = `${(sizeFile / 1024).toFixed(0)} kb`);
        } else {
          return (template = `${sizeFile.toFixed(0)} bytes`);
        }
      };
    
      if(display === true) {
        return (
          
          <div className="archivo-tarea-wrapper-lista-negocio" >
            <div className="archivo-tarea-imagen">
            
              <span>{returnExtIcon(archivo.up_mimetype)}</span>
            </div>
            <div>
              <p className="archivo-tarea-nombre">{archivo.up_filename}</p>
              <div className="archivo-tarea-linea-inferior">
                <p className="archivo-tarea-hora">
                  {archivo.up_fechaupload && fechaArchivoHandler(archivo.up_fechaupload)}
                </p>
                <p className="archivo-tarea-peso">{formatSize(archivo.up_size)}</p>
                <div className="archivo-tarea-item">
                  <LinkOutlined />
                  <p className="archivo-tarea-peso">{archivo.up_detalle}</p>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        <div style={{display:"none"}}>
        </div>
      }
};

export default ArchivoTarea;