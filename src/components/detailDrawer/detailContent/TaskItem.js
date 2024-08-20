import {
  CalendarOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Timeline } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import NoteItem from "./NoteItem";
import UploadItem from "./UploadItem";

const TaskItem = ({ taskData, item }) => {
  const [currentTask, setCurrentTask] = useState();
  const [includeNote, setIncludeNote] = useState();
  const [includeUpload, setIncludeUpload] = useState();

  useEffect(() => {
    const idTarea = item.his_detalle.split("_")[1];
    setCurrentTask(taskData.filter((x) => x.tar_id === Number(idTarea)));
    const tarea = taskData.filter((x) => x.tar_id === Number(idTarea));

    if (tarea && tarea[0]?.not_id) {
      setIncludeNote(tarea);
    }
    if (tarea[0]?.up_id) {
      setIncludeUpload(tarea);
    }
  }, [taskData, item]);

  return (
    currentTask &&
    currentTask.length > 0 && (
      <Timeline.Item color="green" dot={<CalendarOutlined />} key={item.tar_id}>
        <div className="task_wrapper">
          <div className="task_header">
            <div className="task_title">{currentTask[0].tar_asunto}</div>
            {/* <div className="task_info_wrapper"> */}
            <div className="task_info">
              <span className="task_date">
                {moment(currentTask[0].tar_vencimiento).fromNow()}
              </span>
              <span className="task_author">{currentTask[0].usuarioAsignado}</span>
              <div className="task_business">
                <ShopOutlined style={{ marginRight: 4 }} />
                {currentTask[0].cli_nombre}
              </div>

              {currentTask[0].con_nombre && (
                <div className="task_contact">
                  <UserOutlined style={{ marginRight: 4 }} />
                  {currentTask[0].con_nombre}
                </div>
              )}

              <div className="task_business">
                <FileDoneOutlined
                  style={{ marginRight: 4, color: "#00b33c" }}
                />
                <span style={{ color: "#00b33c", marginRight: 8 }}>
                  {currentTask[0].tip_desc}
                </span>
              </div>
              <div className="task-close">
                <ClockCircleOutlined />
                <p className="task-fecha-vencimiento">
                  {moment(
                    currentTask[0].tar_vencimiento +
                      currentTask[0].tar_horavencimiento,
                    "YYYY/MM/DD HH:mm:ss"
                  ).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
        <NoteItem noteData={null} item={includeNote} />
        <UploadItem uploadData={null} item={includeUpload} />
      </Timeline.Item>
    )
  );
};

export default TaskItem;
