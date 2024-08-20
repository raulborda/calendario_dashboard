import { PaperClipOutlined } from "@ant-design/icons";
import { Timeline } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import returnExtIcon from "../../../utils/returnExtIcon";

const UploadItem = ({ uploadData, item }) => {
  const [currentUpload, setCurrentUpload] = useState();

  useEffect(() => {
    if (uploadData) {
      const idUpload = item.his_detalle.split("_");
      setCurrentUpload(
        uploadData.filter((x) => Number(x.up_id) === Number(idUpload[1]))
      );
    } else {
      setCurrentUpload(item);
    }
  }, [uploadData, item]);

  const formatSize = (size) => {
    const sizeFile = Number(size);
    let template;
    if (size >= 1024) {
      return (template = `${(sizeFile / 1024).toFixed(0)} kb`);
    } else {
      return (template = `${sizeFile.toFixed(0)} bytes`);
    }
  };

  //! Si el componente es anidado bajo la tarea no debe incluir Timeline.Item

  return (
    <>
      {!uploadData ? (
        <>
          {currentUpload && currentUpload[0] && (
            <div className="upload-task-wrapper-interno">
              <div className="archivo-tarea-imagen">
                <span>{returnExtIcon(currentUpload[0].up_mimetype)}</span>
              </div>
              <div className="archivo-tarea-descripcion">
                <p className="archivo-tarea-nombre">
                  {currentUpload[0].up_detalle}
                </p>
                <div className="archivo-tarea-linea-inferior">
                  <p className="archivo-tarea-hora">
                    {moment(currentUpload[0].up_fechaupload).fromNow()}
                  </p>
                  <p className="archivo-tarea-peso">
                    {formatSize(currentUpload[0].up_size)}
                  </p>
                  <div className="archivo-tarea-item">
                    <PaperClipOutlined />
                    <p className="archivo-tarea-peso">
                      {currentUpload[0].up_filename}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* {currentUpload && currentUpload[0] && (
            <div className="upload-task-wrapper">
              <h4>{currentUpload && currentUpload[0].up_detalle}</h4>
              <h4>{currentUpload && currentUpload[0].up_filename}</h4>
              <span>
                {currentUpload && returnExtIcon(currentUpload[0].up_mimetype)}
              </span>
            </div>
          )} */}
        </>
      ) : (
        <Timeline.Item color="green" dot={<PaperClipOutlined />}>
          {currentUpload && currentUpload[0] && (
            <div className="upload-task-wrapper">
              <div className="archivo-tarea-imagen">
                <span>{returnExtIcon(currentUpload[0].up_mimetype)}</span>
              </div>
              <div className="archivo-tarea-descripcion">
                <p className="archivo-tarea-nombre">
                  {currentUpload[0].up_detalle}
                </p>
                <div className="archivo-tarea-linea-inferior">
                  <p className="archivo-tarea-hora">
                    {moment(currentUpload[0].up_fechaupload).fromNow()}
                  </p>
                  <p className="archivo-tarea-peso">
                    {formatSize(currentUpload[0].up_size)}
                  </p>
                  <div className="archivo-tarea-item">
                    <PaperClipOutlined />
                    <p className="archivo-tarea-peso">
                      {currentUpload[0].up_filename}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Timeline.Item>
      )}
    </>
  );
};

export default UploadItem;
