import React, { useContext } from 'react';
import moment from "moment";
import { useEffect, useState } from "react";
import { GET_TAREAS_CALENDARIO } from "../../graphql/query/tareas";
import QueryResult from "../../queryResult/QueryResult";
import { useQuery } from '@apollo/client';
import { GlobalContext } from '../../context/GlobalContext';
import { Calendar } from 'antd';
import './Calendario.css';

const Calendario = () => {

    const { userId, } = useContext(GlobalContext);

      /*Estados de consulta */
  const [value, setValue] = useState(() => moment().format("DD/MM/YYYY"));
  const [selectedValue, setSelectedValue] = useState(() => moment().format("DD/MM/YYYY"));
  const [filtroFecha, setFiltroFecha] = useState(moment().format("YYYY-MM-DD"));
  const [tareasCalendario, setTareasCalendario] = useState();
  const [pollTareas, setPollTareas] = useState();
  const [tareas, setTareas] = useState();


  const { data, loading, error, startPolling, stopPolling } = useQuery(GET_TAREAS_CALENDARIO, {
    variables: {
      idUsuario: userId,
    },
  });

  console.log(data);

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
    setPollTareas({inicial:startPolling, stop:stopPolling});
    if (data) {
      if(JSON.parse(data.getTareasPropiasMobileResolver)){
        ordenarDatos(JSON.parse(data.getTareasPropiasMobileResolver).tareasPropiasPorFecha,
          filtroFecha
        );
        setTareasCalendario(
          JSON.parse(data.getTareasPropiasMobileResolver).fechasVenc
        );
      }
    }
  }, [data, filtroFecha]);

  useEffect(() => {
    startPolling(1000);
    setTimeout(() => {
      stopPolling();
    }, 1000);
  }, [data])

 
  const onSelect = (newValue) => {
    setValue(newValue.format("DD/MM/YYYY"));
    setSelectedValue(newValue.format("DD/MM/YYYY"));
  };
  const onPanelChange = (newValue) => {
    setValue(newValue.format("DD/MM/YYYY"));
  };

  console.log(selectedValue);


    return (
        <>
          <div className="div_wrapper">
            <div className="titulo">Calendario</div>
            <div className="calendar">
              <Calendar
                fullscreen={false}
                onSelect={onSelect}
                onPanelChange={onPanelChange}
              />
            </div>
            <div className="lista_tareas">
              <QueryResult loading={loading} error={error} data={tareas}>
                <div className="div_lista_calendario">
                  {tareas && (
                    tareas.map((tarea) => (
                      tarea.id
                    ))
                  )}
                </div>
              </QueryResult>
            </div>
          </div>
        </>
    );
};

export default Calendario;