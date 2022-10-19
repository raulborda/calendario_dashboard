import React from "react";
import moment from "moment";
import "./NotaTarea.css";



const NotaTarea = ({ nota, interno = false, display = true }) => {
  const colorPrioridad = (prioridad) => {
    let color = "";

    switch (prioridad) {
      case "ALTA":
        color = "rgb(241, 45, 45)";
        break;
      case "MEDIA":
        color = "rgb(232, 188, 13)";
        break;
      default:
        color = "rgb(0, 179, 60)";
        break;
    }
    return color;
  };

  let notaFecha;
  if (nota.not_fechahora) {
    notaFecha = moment(nota.not_fechahora, "YYYY-MM-DD").format("LL");
  }

  if (display === true) {
    return (
      <div
      className="nota-tarea-wrapper-lista-negocio"
        // // className={
        // //   origen
        // //     ? "nota-tarea-wrapper-lista-negocio"
        // //     : interno
        // //     ? "nota-tarea-wrapper-interno"
        // //     : "nota-tarea-wrapper"
        // // }
      >
        <div className="nota-tarea-linea-superior">
          <p className="nota-tarea-fecha">{notaFecha}</p>
          <div
            className="nota-tarea-prioridad"
            style={{ backgroundColor: colorPrioridad(nota.pri_desc) }}
          >
            <p style={{ margin: "0px" }}>{nota.pri_desc}</p>
          </div>
        </div>
        <div
          style={{ padding: "4px 8px" }}
          dangerouslySetInnerHTML={{
            __html: nota.not_desc,
          }}
        ></div>
      </div>
    );
  } else {
    <div style={{ display: "none" }}></div>;
  }
};

export default NotaTarea;
