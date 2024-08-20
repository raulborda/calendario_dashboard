import { CopyOutlined } from "@ant-design/icons";
import { Badge, Timeline } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import '../../notaTarea/NotaTarea.css'

const NoteItem = ({ noteData, item }) => {
  const [currentTask, setCurrentTask] = useState();

  const returnPriorityColor = (prioridad) => {
    switch (true) {
      case prioridad === "ALTA":
        return "#f12d2d";
      case prioridad === "MEDIA":
        return "#e8bc0d";
      case prioridad === "BAJA":
        return "#00b33c";
      default:
        return "#f12d2d";
    }
  };

  useEffect(() => {
    //* se ejecuta desde dealContent recibe noteData e item para filtrar la data
    if (noteData) {
      const idTarea = item.his_detalle.split("_");

      setCurrentTask(
        noteData.filter((x) => Number(x.not_id) === Number(idTarea[1]))
      );
      //* se ejecuta directamente desde dentro de TaskItem por lo tanto no debe filtrar, solo retornar
    } else {
      setCurrentTask(item);
    }
  }, [noteData, item]);

  //! Si el componente es anidado bajo la tarea no debe incluir Timeline.Item

  return (
    <>
      {!noteData ? (
        <>
          {currentTask && currentTask.length > 0 && (
            <Badge.Ribbon
              text={currentTask && currentTask[0].pri_desc}
              color={returnPriorityColor(currentTask[0].pri_desc)}
            >
              <div className="note-wrapper-interno">
                <div className="nota-tarea-linea-superior">
                  <p className="nota-tarea-fecha">
                    {`${moment(currentTask[0].not_fechahora).format("LL")} • ${
                      currentTask[0].usu_nombre
                    }`}
                  </p>
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: currentTask && currentTask[0].not_desc,
                  }}
                ></div>
              </div>
            </Badge.Ribbon>
          )}
        </>
      ) : (
        <Timeline.Item color="green" dot={<CopyOutlined />}>
          {currentTask && currentTask.length > 0 && (
            <Badge.Ribbon
              text={currentTask && currentTask[0].pri_desc}
              color={returnPriorityColor(currentTask[0].pri_desc)}
            >
              <div className="note-wrapper">
                <div className="nota-tarea-linea-superior">
                  <p className="nota-tarea-fecha">
                    {`${moment(currentTask[0].not_fechahora).format("LL")} • ${
                      currentTask[0].usu_nombre
                    }`}
                  </p>
                </div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: currentTask && currentTask[0].not_desc,
                  }}
                ></div>
              </div>
            </Badge.Ribbon>
          )}
        </Timeline.Item>
      )}
    </>
  );
};

export default NoteItem;
