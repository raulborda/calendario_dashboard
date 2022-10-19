/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from "react";
import moment from "moment";
import { useEffect, useState } from "react";
import { GET_TAREAS_CALENDARIO } from "../../graphql/query/tareas";
import QueryResult from "../../queryResult/QueryResult";
import { useQuery } from "@apollo/client";
import { GlobalContext } from "../../context/GlobalContext";
import { Badge, Calendar, Spin } from "antd";
import "./Calendario.css";
import {
  DownOutlined,
  ClockCircleOutlined,
  UserOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import NotaTarea from "../notaTarea/NotaTarea";
import ArchivoTarea from "../archivoTarea/ArchivoTarea";

const Calendario = () => {
  const { userId } = useContext(GlobalContext);

  /*Estados de consulta */
  const [value, setValue] = useState(() => moment().format("DD/MM/YYYY"));
  const [selectedValue, setSelectedValue] = useState(() =>
    moment().format("DD/MM/YYYY")
  );
  const [filtroFecha, setFiltroFecha] = useState(moment().format("YYYY-MM-DD"));
  const [tareasCalendario, setTareasCalendario] = useState();
  const [pollTareas, setPollTareas] = useState();
  const [tareas, setTareas] = useState();
  const [mostrar, setMostrar] = useState(false);

  const [tasksDates, setTasksDates] = useState([]);

  const { data, loading, error, startPolling, stopPolling } = useQuery(
    GET_TAREAS_CALENDARIO,
    {
      variables: {
        idUsuario: userId,
      },
    }
  );

  console.log(data);

  const getListData = (value) => {
    let listData = [];

    const existeTarea = tasksDates.filter((item) => {
      return item.tar_vencimiento === moment(value).format("YYYY-MM-DD");
    });

    if (existeTarea.length > 0) {
      listData = [
        {
          type: "1",
        },
      ];
    } else {
      listData = [
        {
          type: "0",
        },
      ];
    }

    return listData;
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);

    return (
      <span>
        {listData.map((item, idx) => {
          return (
            <Badge
              key={idx}
              size="small"
              dot={true}
              color={item.type === "1" ? "green" : "white"}
            />
          );
        })}
      </span>
    );
  };

  //*Handles para separar las fechasHoras en fecha y hora como viene de base de datos con moment.js

  const handleFechaVer = (val) => {
    let fecha = moment(val, "DD/MM/YYYY").format("DD/MM/YYYY");
    return fecha;
  };

  const handleHora = (val) => {
    let horaSola = moment(val, "HH:mm:ss").format("LT");
    return horaSola;
  };

  const ordenarDatos = (tareasBasico, filtroFecha) => {
    let fecha = moment(filtroFecha, "YYYY-MM-DD").format("DD/MM/YYYY");
    let tareasOrdenadas;
    if (tareasBasico) {
      tareasBasico = tareasBasico.filter(
        (tarea) => tarea.fechavencimiento === fecha
      );
      tareasOrdenadas = tareasBasico.sort(function (a, b) {
        return (
          new Date(
            moment(b.fechavencimiento, "DD/MM/YYYY").format("YYYY,MM,DD")
          ) -
          new Date(
            moment(a.fechavencimiento, "DD/MM/YYYY").format("YYYY,MM,DD")
          )
        );
      });
      setTareas(tareasOrdenadas);
    }
  };

  useEffect(() => {
    setPollTareas({ inicial: startPolling, stop: stopPolling });
    if (data) {
      const tareas = JSON.parse(data.getTareasPropiasMobileResolver);

      if (JSON.parse(data.getTareasPropiasMobileResolver)) {
        ordenarDatos(
          JSON.parse(data.getTareasPropiasMobileResolver).tareasPropiasPorFecha,
          filtroFecha
        );
        setTareasCalendario(
          JSON.parse(data.getTareasPropiasMobileResolver).fechasVenc
        );
        setTasksDates(tareas.fechasVenc);
      }
    }
  }, [data, filtroFecha]);

  useEffect(() => {
    startPolling(1000);
    setTimeout(() => {
      stopPolling();
    }, 1000);
  }, [data]);

  let fechaActual = moment();

  const dateHandler = (fecha) => {
    let fechaParametro = moment(fecha, "DD/MM/YYYY");

    const diff = moment(fechaParametro).diff(fechaActual, "days");

    switch (true) {
      case diff <= 0:
        return "#F44336";
      case diff > 0 && diff <= 5:
        return "#faad14";

      default:
        return "#00b33c";
    }
  };

  const onSelect = (value) => {
    setValue(value.format("DD/MM/YYYY"));
    setSelectedValue(value.format("DD/MM/YYYY"));
    setFiltroFecha(value.format("YYYY-MM-DD"));
  };
  const onPanelChange = (value) => {
    setValue(value.format("DD/MM/YYYY"));
  };

  console.log(selectedValue);

  return (
    <>
      <div className="div_wrapper">
        <div className="titulo">Calendario</div>
        <div className="calendar">
          <Calendar
            dateCellRender={dateCellRender}
            fullscreen={false}
            onSelect={onSelect}
            onPanelChange={onPanelChange}
            // onChange={(v) => setFilterDate(moment(v).format("YYYY-MM-DD"))}
          />
        </div>
        <div className="lista_tareas">
          <QueryResult loading={loading} error={error} data={tareas}>
            <div className="div_lista_calendario">
              {tareas &&
                tareas.map((tarea) => (
                  <div className="tarea-negocio-contenedor">
                    <div
                      className="tarea-negocio-wrapper wrapper_lista"
                      onClick={() => setMostrar(!mostrar)}
                    >
                      <div className="tarea-negocio-linea-superior">
                        <p
                          style={{
                            fontWeight: "bold",
                            width: "100%",
                            fontSize: "16px",
                            marginTop: "4px",
                            color: "#454545",
                          }}
                        >
                          {tarea.tar_asunto}
                        </p>
                      </div>
                      <div className="tarea-negocio-linea-intermedia">
                        {tarea.cli_nombre ? (
                          <div className="tarea-negocio-item">
                            <UserOutlined
                              style={{ color: "#00B33C", marginTop: "-5px" }}
                            />
                            <p className="tarea-negocio-contacto">
                              {tarea.cli_nombre}
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                        {tarea.tip_desc ? (
                          <div className="tarea-negocio-item">
                            <InfoCircleOutlined
                              style={{ color: "#00B33C", marginTop: "-2px" }}
                            />
                            <p className="tarea-negocio-tipoTarea">
                              {tarea.tip_desc}
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="tarea-negocio-linea-inferior">
                        <div className="tarea-negocio-linea-inferior-uno">
                          <div className="tarea-contenedor-horario">
                            <ClockCircleOutlined
                              style={{
                                color: dateHandler(tarea.fechavencimiento),
                                fontSize: "0.8rem",
                              }}
                            />
                            <p className="texto-tarea-horario">
                              {handleFechaVer(tarea.fechavencimiento)}
                            </p>
                            {tarea.tar_horavencimiento && (
                              <p className="texto-tarea-horario">
                                {handleHora(tarea.tar_horavencimiento)} hs
                              </p>
                            )}
                          </div>
                          <div className="tarea-contenedor-horario">
                            {tarea.pri_desc === "ALTA" ? (
                              <div
                                style={{
                                  height: "20px",
                                  width: "40px",
                                  fontSize: "12px",
                                  backgroundColor: "rgb(241, 45, 45)",
                                  color: "white",
                                  border: "solid 1px rgb(241, 45, 45)",
                                  borderRadius: "4px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  padding: "2px 5px",
                                }}
                              >
                                ALTA
                              </div>
                            ) : null}
                            {tarea.pri_desc === "MEDIA" ? (
                              <div
                                style={{
                                  height: "20px",
                                  width: "40px",
                                  fontSize: "12px",
                                  backgroundColor: "rgb(232, 188, 13)",
                                  color: "white",
                                  border: "solid 1px rgb(232, 188, 13)",
                                  borderRadius: "4px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  padding: "2px 5px",
                                }}
                              >
                                MEDIA
                              </div>
                            ) : null}
                            {tarea.pri_desc === "BAJA" ? (
                              <div
                                style={{
                                  height: "20px",
                                  width: "40px",
                                  fontSize: "12px",
                                  backgroundColor: "rgb(0, 179, 60)",
                                  color: "white",
                                  border: "solid 1px rgb(0, 179, 60)",
                                  borderRadius: "4px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  padding: "2px 5px",
                                }}
                              >
                                BAJA
                              </div>
                            ) : null}
                          </div>
                          <div className="tarea-contenedor-horario">
                            <p
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                border: "solid 1px #f4f4f4",
                                height: "22px",
                                width: "auto",
                                fontSize: "12px",
                                color: tarea.ori_color,
                                borderColor: tarea.ori_color,
                                backgroundColor: "white",
                                padding: "2px 5px",
                                borderRadius: "4px",
                                marginLeft: "-2px",
                                marginRight: "3px",
                                marginTop: "11px",
                              }}
                            >
                              {tarea.ori_desc}
                            </p>
                          </div>
                        </div>
                        <div className="tarea-negocio-linea-inferior-dos">
                          <div className="VerMas">
                            {(tarea.not_id &&
                              tarea.not_desc !== "<p><br></p>") ||
                            tarea.up_id ? (
                              <DownOutlined />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    {tarea.not_id && tarea.not_desc !== "<p><br></p>" ? (
                      <NotaTarea
                        nota={tarea}
                        interno={true}
                        display={mostrar}
                      />
                    ) : null}
                    {tarea.up_id && (
                      <ArchivoTarea
                        archivo={tarea}
                        interno={true}
                        display={mostrar}
                      />
                    )}
                  </div>
                ))}
            </div>
          </QueryResult>
        </div>
      </div>
    </>
  );
};

export default Calendario;
