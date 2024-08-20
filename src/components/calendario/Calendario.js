/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext } from "react";
import moment from "moment";
import { useEffect, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { GET_TAREAS_CALENDARIO } from "../../graphql/query/tareas";
import QueryResult from "../../queryResult/QueryResult";
import { useMutation, useQuery } from "@apollo/client";
import { GlobalContext } from "../../context/GlobalContext";
import {
  Badge,
  Button,
  Calendar,
  ConfigProvider,
  Image,
  Input,
  List,
  Popconfirm,
  Popover,
  Space,
  Table,
  Tag,
  Drawer
} from "antd";
import "./Calendario.css";
import {
  UserOutlined,
  CheckOutlined,
  PaperClipOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { UPDATE_ESTADO_TAREA } from "../../graphql/mutation/tareas";
import OpenNotification from "../notificacion/OpenNotification";
import { GET_CUMPLEANIOS_CALENDARIO } from "../../graphql/query/cumpleanios";
import locale from "antd/es/locale/es_ES";
import "moment/locale/es";
import DetailDrawer from "../detailDrawer/DetailDrawer";

const Calendario = () => {
  const URL = process.env.REACT_APP_URL;
  const [updateEstadoTareaIframeResolver] = useMutation(UPDATE_ESTADO_TAREA);
  const { userId, setTaskDrawerVisible } = useContext(GlobalContext);
  const [showDetailDrawer, setShowDetailDrawer] = useState({
    visible: false,
    type: "",
    idContent: null,
  });

  //moment.locale("es");

  /*Estados de consulta */
  const [value, setValue] = useState(() => moment().format("DD/MM/YYYY"));
  const [selectedValue, setSelectedValue] = useState(() =>
    moment().format("DD/MM/YYYY")
  );
  const [filtroFecha, setFiltroFecha] = useState(moment().format("YYYY-MM-DD"));
  const [tareasCalendario, setTareasCalendario] = useState();
  const [pollTareas, setPollTareas] = useState();
  const [tareas, setTareas] = useState();

  const [fechaNacCalendar, setFechaNacCalendar] = useState(
    moment().format("DD-MM")
  );
  const [listaCumple, setListaCumple] = useState([]);

  const [tasksDates, setTasksDates] = useState([]);

  const [selectedClient, setSelectedClient] = useState();
  const [clientDrawerVisible, setClientDrawerVisible] = useState(false);

  const { data, loading, error, startPolling, stopPolling } = useQuery(
    GET_TAREAS_CALENDARIO,
    {
      variables: {
        idUsuario: userId,
      },
    }
  );

  const {
    data: dataCumpleanito,
    loading: loadingCumpleanito,
    error: errorCumpleanito,
  } = useQuery(GET_CUMPLEANIOS_CALENDARIO, {
    variables: {
      fechaNac: fechaNacCalendar,
    },
  });

  let array = [];
  let fechaC = "";
  useEffect(() => {
    if (dataCumpleanito) {
      const cumpleanio = JSON.parse(dataCumpleanito.getCumpleaniosResolver);
      for (let index = 0; index < cumpleanio.length; index++) {
        let nombre = cumpleanio[index].con_nombre;
        const edad = cumpleanio[index].edad;
        let empresa = cumpleanio[index].cli_nombre;

        fechaC = moment(cumpleanio[index].con_fechanac, "YYYY-MM-DD").format(
          "DD-MM"
        );

        if (empresa === null) {
          empresa = "";
        }

        let frase = fechaC + " CUMPLE " + edad + " AÑOS " + nombre;
        array.push(frase);
      }

      setListaCumple(array);
    }
  }, [dataCumpleanito]);

  const getListData = (value) => {
    let listData = [];

    const existeTarea = tasksDates?.filter((item) => {
      return item.tar_vencimiento === moment(value).format("YYYY-MM-DD");
    });

    if (existeTarea.length > 0) {
      //console.log('existeTarea', existeTarea)
      listData = [
        {
          type: "1",
          tar_vencimiento: existeTarea[0].tar_vencimiento,
          count: existeTarea.length
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
      <>
        <span>
          {listData.map((item, idx) => (
            <Badge
              //size = 'small'
              count={item.count}
              key={idx}
              color={item.count > 0 ? "green" : 'transparent'}
            />
          ))}
        </span>
      </>
    );
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
        setTasksDates(tareas.AllFechasVencTareas);
        //console.log('tareas.fechasVenc', tareas.fechasVenc)
      }
    }
  }, [data, filtroFecha, userId]);

  useEffect(() => {
    startPolling(1000);
    setTimeout(() => {
      stopPolling();
    }, 1000);
  }, [data, dataCumpleanito]);

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
    setFechaNacCalendar(value.format("DD-MM"));
  };

  const onPanelChange = (value) => {
    setValue(value.format("DD/MM/YYYY"));
    setFechaNacCalendar(value.format("DD-MM"));
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
      <SearchOutlined style={{ color: filtered ? "#56b43c" : undefined }} />
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
      align: "center",
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
      width: 45,
    },
    {
      title: "Asunto",
      dataIndex: "tar_asunto",
      key: "tar_asunto",
      ellipsis: true,
      width: 175,
      ...getColumnSearchProps("tar_asunto"),
    },
    {
      title: "Cliente",
      dataIndex: "cli_nombre",
      key: "cli_nombre",
      ellipsis: true,
      width: 90,
      ...getColumnSearchProps("cli_nombre"),
      render: (text, record) => (
        <div
          style={{
            color: "#00b33c",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
          onClick={() => { localStorage.setItem("cliSelect", record?.cli_id);
            ;setSelectedClient(record); setClientDrawerVisible(true) }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Fuente",
      key: "fuente",
      width: 80,
      dataIndex: "ori_id",
      render: (dataIndex, item) => (
        <Tag
          //onClick={() => handleDetail(item)}
          //style={{ cursor: item.ori_desc === 'NEGOCIO' ? "pointer" : "defualt" }}
          color={item.ori_color}
          key={"key"}>
          {item.ori_desc}
        </Tag>
      ),
    },
    {
      title: "Creación",
      key: "fechaCreacion",
      width: 75,
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
      width: 75,
      sorter: (a, b) => {
        a.tar_vencimiento.localeCompare(b.tar_vencimiento);
      },
      render: (dataIndex, item) => (
        <div className="vencimiento-wrapper">
          <span style={{ marginRight: "5px" }}>
            {dataIndex ? moment(dataIndex).format("DD/MM/YYYY") : "-"}
          </span>
        </div>
      ),
    },
    {
      title: "Hora",
      key: "horaVto",
      dataIndex: "tar_horavencimiento",
      showSorterTooltip: false,
      width: 45,
      sorter: (a, b) => {
        a.tar_horavencimiento.localeCompare(b.tar_horavencimiento);
      },
      render: (dataIndex, item) => (
        <div className="vencimiento-wrapper">
          <span style={{ marginRight: "5px" }}>
            {dataIndex ? moment(dataIndex, "LT").format("HH:mm") : "-"}
          </span>
        </div>
      ),
    },
    {
      title: "Módulo",
      key: "modori",
      width: 70,
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
      width: 30,
      align: "center",
      render: (dataIndex, item) => (
        <div className="options-wrapper">
          <Popconfirm
            placement="topLeft"
            title="¿Desea completar la tarea?"
            okText="Si"
            cancelText="No"
            onConfirm={() => confirm(item)}
          >
            <CheckOutlined
              style={{ fontSize: "12px", color: "green" }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onCloseDrawerCli = () => {
    //setActualizarData(!actualizarData)
    setClientDrawerVisible(false);
  };

  return (
    <>
      <ConfigProvider locale={locale}>
        <div className="div_wrapper">
          <div>
            <div className="titulo">Tareas</div>
          </div>
          <div className="calendar_lista">
            <div
              className="calendar"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <div className="popoverC" style={{ display: clientDrawerVisible ? 'none' : 'block' }}>
                <Popover
                  placement="bottomLeft"
                  title={"Cumpleaños"}
                  content={
                    listaCumple &&
                    listaCumple.map((c) => (
                      <List.Item key={c}>{c.toUpperCase()}</List.Item>
                    ))
                  }
                >
                  <Button style={{ border: "none", boxShadow: "none" }}>
                    <Image
                      src={"./assets/birthday-cake.png"}
                      alt="image"
                      preview={false}
                      width={20}
                      height={20}
                    />
                  </Button>
                </Popover>
              </div>
              <Calendar
                size="small"
                dateCellRender={dateCellRender}
                fullscreen={false}
                onSelect={onSelect}
                onPanelChange={onPanelChange}
              />
            </div>
            <div className="lista_tareas">
              <QueryResult loading={loading} error={error} data={tareas}>
                <Table
                  style={{ width: "100%", overflowX: "auto", minWidth: "850px" }}
                  // scroll={{
                  //   y: 320,
                  // }}
                  onRow={(record, rowIndex) => {
                    return {
                      onClick: (event) => {
                        // alert(JSON.stringify(record));
                      }, // click row
                      onDoubleClick: (event) => { }, // double click row
                      onContextMenu: (event) => { }, // right button click row
                      onMouseEnter: (event) => { }, // mouse enter row
                      onMouseLeave: (event) => { }, // mouse leave row
                    };
                  }}
                  columns={columns}
                  dataSource={tareas}
                  rowKey={"tar_id"}
                  size="small"
                />
              </QueryResult>
            </div>
          </div>
        </div>


        {selectedClient && selectedClient.cuenta !== "" && (
          <Drawer
            className="drawerCli"
            open={clientDrawerVisible}
            onClose={onCloseDrawerCli}
            placement="bottom"
            height={"100%"}
            style={{ whiteSpace: "nowrap" }}
            closeIcon={
              <CloseOutlined
                style={{ position: "absolute", top: "8px", right: "8px" }}
              />
            }
            bodyStyle={{ padding: "10px" }}
          >
            <iframe
              loading="lazy"
              src={`${URL}vista_cliente/?idC=${selectedClient?.cli_id}`}
              width={"100%"}
              style={{ border: "none", height: "calc(100% - 10px)" }}
              title="drawer"
            ></iframe>
          </Drawer>
        )}

        <DetailDrawer
          showDetailDrawer={showDetailDrawer}
          closeDrawer={setShowDetailDrawer}
        />
      </ConfigProvider>
    </>
  );
};

export default Calendario;
