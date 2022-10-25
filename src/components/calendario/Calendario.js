/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from "react";
import moment from "moment";
import { useEffect, useState } from "react";
import { GET_TAREAS_CALENDARIO } from "../../graphql/query/tareas";
import QueryResult from "../../queryResult/QueryResult";
import { useMutation, useQuery } from "@apollo/client";
import { GlobalContext } from "../../context/GlobalContext";
import {
  Badge,
  Button,
  Calendar,
  Input,
  Popconfirm,
  Popover,
  Space,
  Table,
  Tag,
} from "antd";
import "./Calendario.css";
import {
  DownOutlined,
  ClockCircleOutlined,
  UserOutlined,
  InfoCircleOutlined,
  EditOutlined,
  CheckOutlined,
  PaperClipOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import NotaTarea from "../notaTarea/NotaTarea";
import ArchivoTarea from "../archivoTarea/ArchivoTarea";
import { UPDATE_ESTADO_TAREA } from "../../graphql/mutation/tareas";
import OpenNotification from "../notificacion/OpenNotification";

const Calendario = () => {
  const [updateEstadoTareaIframeResolver] = useMutation(UPDATE_ESTADO_TAREA);
  const { userId } = useContext(GlobalContext);
  const { setTaskDrawerVisible } = useContext(GlobalContext);
  const [showDetailDrawer, setShowDetailDrawer] = useState({
    visible: false,
    type: "",
    idContent: null,
  });

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

  const handleDetail = (item) => {
    //TODO handle tipo de detalle(negocio,encuestas,lotes,etc)
    if (item.neg_id) {
      setShowDetailDrawer({
        visible: true,
        type: "negocio",
        idContent: item.neg_id,
      });
    }
  };

  const confirm = (item) => {
    updateEstadoTareaIframeResolver({
      variables: { idTarea: item.tar_id },
    }).then((res) => {
      const { data } = res;
      const resp = JSON.parse(data.updateEstadoTareaIframeResolver);
      startPolling(1000);
      setTimeout(() => {
        stopPolling();
      }, 1000);
    OpenNotification(
      <h4>{resp.response}</h4>,
      null,
      "topleft",
      <CheckOutlined style={{ color: "green" }} />,
      null
    );
    });
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };
  const handleReset = (clearFilters) => {
    clearFilters();
  };

  console.log(selectedValue);
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={"Buscar ..."}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reiniciar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
  });

  const columns = [
    {
      title: "...",
      dataIndex: "",
      key: "prioridad",
      render: (dataIndex, item) => {
        let tagColor = "";
        switch (true) {
          case item.pri_id === 1:
            tagColor = "red";
            break;
          case item.pri_id === 2:
            tagColor = "gold";
            break;
          case item.pri_id === 3:
            tagColor = "green";
            break;
          default:
            break;
        }
        return (
          <div className="firstcolumn-wrapper">
            <Tag color={tagColor}>{item.pri_desc}</Tag>
            {item.up_id && (
              <PaperClipOutlined
                onClick={() => {
                  setTaskDrawerVisible({
                    visible: true,
                    content: "Ver Tarea",
                    task: item,
                  });
                }}
              />
            )}
          </div>
        );
      },
      width: 80,
    },
    {
      title: "Asunto",
      dataIndex: "tar_asunto",
      key: "tar_asunto",
      ellipsis: true,
      width: 200,
      ...getColumnSearchProps("tar_asunto"),
    },
    {
      title: "Cliente",
      dataIndex: "cli_nombre",
      key: "cli_nombre",
      width: 200,
      ...getColumnSearchProps("cli_nombre"),
      render: (dataIndex, item) => {
        return (
          <span>
            {dataIndex}
            <span>
              {" "}
              {item.con_nombre && (
                <Popover
                  title={item.con_nombre}
                  trigger={"hover"}
                  placement="top"
                  content={
                    <div className="infocontacto-wrapper">
                      <span>{item.con_telefono1}</span>
                      <span>{item.con_email1}</span>
                    </div>
                  }
                >
                  <UserOutlined />
                </Popover>
              )}
            </span>
          </span>
        );
      },
    },
    {
      title: "Fuente",
      key: "fuente",
      width: 90,
      dataIndex: "ori_id",
      render: (dataIndex, item) => (
        <Tag color={item.ori_color} key={"key"}>
          {item.ori_desc}
        </Tag>
      ),
    },
    {
      title: "Creación",
      key: "fechaCreacion",
      width: 100,
      dataIndex: "fechacreacion",
      sorter: (a, b) => a.tar_fecha.localeCompare(b.tar_fecha),
      showSorterTooltip: false,
      // render: (dataIndex, item) => {
      //   return <span>{moment(dataIndex).format("DD/MM/YYYY")}</span>;
      // },
    },
    {
      title: "Vencimiento",
      key: "fechaVto",
      dataIndex: "tar_vencimiento",
      showSorterTooltip: false,
      width: 150,
      sorter: (a, b) => {
        a.tar_vencimiento.localeCompare(b.tar_vencimiento);
      },
      render: (dataIndex, item) => (
        <div className="vencimiento-wrapper">
          <span style={{ marginRight: "5px" }}>
            {dataIndex ? moment(dataIndex).format("DD/MM/YYYY") : "-"}
          </span>
          {/* <span>
            {item.tar_horavencimiento && item.tar_horavencimiento.slice(0, -3)}
          </span> */}
        </div>
      ),
    },
    {
      title: "Asignado",
      key: "asignado",
      width: 90,
      dataIndex: "asignado",
      render: (dataIndex, item) => <span>{item.usu_nombre} </span>,
    },
    {
      title: "Módulo",
      key: "modori",
      width: 90,
      dataIndex: "mod_id",
      render: (dataIndex, item) => {
        return (
          <Tag
            color="lime"
            onClick={() => handleDetail(item)}
            style={{ cursor: "pointer" }}
          >
            {item.modori_desc ? item.modori_desc : "TAREAS"}
          </Tag>
        );
      },
    },
    {
      title: "",
      key: "",
      width: 90,
      render: (dataIndex, item) => (
        <div className="options-wrapper">
          {/* <EyeOutlined
            style={{ fontSize: "12px", marginRight: "15px", color: "green" }}
            onClick={() => {
              setTaskDrawerVisible({
                visible: true,
                content: "Ver Tarea",
                task: item,
              });
            }}
          />
          <EditOutlined
            style={{ fontSize: "12px", marginRight: "15px", color: "green" }}
            onClick={() => {
              setTaskDrawerVisible({
                visible: true,
                content: "Editar Tarea",
                task: item,
              });
            }}
          /> */}
          <Popconfirm
            placement="topLeft"
            title="¿Desea completar la tarea?"
            okText="Si"
            cancelText="No"
            onConfirm={() => confirm(item)}
          >
            <CheckOutlined style={{ fontSize: "12px", color: "green", marginLeft:"50%" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="div_wrapper">
        <div className="titulo">Tareas</div>
        <div className="calendar_lista">
          <div className="calendar">
            <Calendar
              size="small"
              dateCellRender={dateCellRender}
              fullscreen={false}
              onSelect={onSelect}
              onPanelChange={onPanelChange}
            />
          </div>
          <div className="lista_tareas" style={{}}>
            <QueryResult loading={loading} error={error} data={tareas}>
              <Table
                scroll={{
                  y:320,
                }}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: (event) => {
                      // alert(JSON.stringify(record));
                      // console.log("click", record);
                    }, // click row
                    onDoubleClick: (event) => {}, // double click row
                    onContextMenu: (event) => {}, // right button click row
                    onMouseEnter: (event) => {}, // mouse enter row
                    onMouseLeave: (event) => {}, // mouse leave row
                  };
                }}
                columns={columns}
                dataSource={tareas}
                rowKey={"tar_id"}
                size="small"
              />
              {/* <DetailDrawer
                showDetailDrawer={showDetailDrawer}
                closeDrawer={setShowDetailDrawer}
              /> */}
            </QueryResult>
          </div>
        </div>
      </div>
    </>
  );
};

export default Calendario;
