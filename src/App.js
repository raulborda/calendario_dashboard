/* eslint-disable array-callback-return */
import "./App.css";
import { Calendar, ConfigProvider } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { GET_TAREAS_CALENDARIO } from "./graphql/query/tareas";
import { ApolloProvider, useQuery } from "@apollo/client";
import Client from "./apollo/apolloClient";
import esES from "antd/es/locale/es_ES";

function App() {
  /*Estados de consulta */
  // const [filtroFecha, setFiltroFecha] = useState(moment().format("YYYY-MM-DD"));
  // const [tareasCalendario, setTareasCalendario] = useState();
  // const [tareas, setTareas] = useState();
  // const [UserId, setUserId] = useState();

  // useEffect(() => {
  //   const url = window.location;
  //   const urlSearch = url.search;

  //   if (urlSearch) {
  //     const params = urlSearch.split("=");
  //     const idUserFromParams = params[1];
  //     setUserId(Number(idUserFromParams));
  //     console.log("Usuario ->", idUserFromParams);
  //   }
  // }, []);

  // const ordenarDatos = (tareasBasico, filtroFecha) => {
  //   let fecha = moment(filtroFecha, "YYYY-MM-DD").format("DD/MM/YYYY");
  //   let tareasOrdenadas;
  //   if (tareasBasico) {
  //     tareasBasico = tareasBasico.filter(
  //       (tarea) => tarea.fechavencimiento === fecha
  //     );
  //     tareasOrdenadas = tareasBasico.sort(function (a, b) {
  //       return (
  //         new Date(
  //           moment(b.fechavencimiento, "DD/MM/YYYY").format("YYYY,MM,DD")
  //         ) -
  //         new Date(
  //           moment(a.fechavencimiento, "DD/MM/YYYY").format("YYYY,MM,DD")
  //         )
  //       );
  //     });
  //     setTareas(tareasOrdenadas);
  //   }
  // };

  // const handleChange = (val) => {
  //   setFiltroFecha(moment(val).format("YYYY-MM-DD"));
  // };

  // const {
  //   data,
  //   startPolling,
  //   stopPolling,
  // } = useQuery(GET_TAREAS_CALENDARIO, {
  //   variables: {
  //     idUsuario: UserId,
  //   },
  // });

  // useEffect(() => {
  //   if (data) {
  //     if(JSON.parse(data.getTareasPropiasMobileResolver)){
  //       ordenarDatos(JSON.parse(data.getTareasPropiasMobileResolver).tareasPropiasPorFecha,
  //         filtroFecha
  //       );
  //       setTareasCalendario(
  //         JSON.parse(data.getTareasPropiasMobileResolver).fechasVenc
  //       );
  //     }
  //   }
  // }, [data, filtroFecha]);

  // useEffect(() => {
  //   startPolling(1000);
  //   setTimeout(() => {
  //     stopPolling();
  //   }, 1000);
  // }, [data])

  return (
    <ApolloProvider client={Client}>
      <ConfigProvider locale={esES}>
        <div className="div_wrapper">
          <div className="titulo">Calendario</div>
          <div className="calendar">
            <Calendar fullscreen={false} />
          </div>
        </div>
      </ConfigProvider>
    </ApolloProvider>
  );
}

export default App;
