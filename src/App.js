/* eslint-disable array-callback-return */
import "./App.css";
import { ConfigProvider } from "antd";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "./apollo/apolloClient";
import esES from "antd/es/locale/es_ES";
import Calendario from "./components/calendario/Calendario";
import { useEffect, useState } from "react";
import { GlobalContext } from "./context/GlobalContext";
import moment from "moment";
import locale from "antd/lib/date-picker/locale/es_ES";

function App() {
  const [userId, setUserId] = useState();

  const [queryPollDealContent, setQueryPollDealContent] = useState();

  //* handle del contenido del componente nota para utilizar en formulario
  const [noteContent, setNoteContent] = useState("");

  useEffect(() => {
    const url = window.location;
    const urlSearch = url.search;

    if (urlSearch) {
      const params = urlSearch.split("=");
      const idUserFromParams = params[1];
      setUserId(Number(idUserFromParams));
    }
  }, []);

  const [taskDrawerVisible, setTaskDrawerVisible] = useState({
    visible: false,
    content: null,
  });

  moment.locale("es");

  console.log('version modulo-calendario-dashboard: 20.08.24');

  return (
    <ApolloProvider client={apolloClient}>
      <ConfigProvider locale={locale}>
        <GlobalContext.Provider
          value={{
            userId,
            setUserId,
            taskDrawerVisible,
            setTaskDrawerVisible,
            queryPollDealContent, 
            setQueryPollDealContent,
            noteContent,
            setNoteContent,
          }}
        >
          <Calendario />
        </GlobalContext.Provider>
      </ConfigProvider>
    </ApolloProvider>
  );
}

export default App;
