/* eslint-disable array-callback-return */
import "./App.css";
import { ConfigProvider } from "antd";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "./apollo/apolloClient";
import esES from "antd/es/locale/es_ES";
import Calendario from "./components/calendario/Calendario";
import { useEffect, useState } from "react";
import { GlobalContext } from "./context/GlobalContext";

function App() {
  const [userId, setUserId] = useState();

  useEffect(() => {
    const url = window.location;
    const urlSearch = url.search;

    if (urlSearch) {
      const params = urlSearch.split("=");
      const idUserFromParams = params[1];
      setUserId(Number(idUserFromParams));
      console.log("Usuario ->", idUserFromParams);
    }
  }, []);

  const [taskDrawerVisible, setTaskDrawerVisible] = useState({
    visible: false,
    content: null,
  });

  return (
    <ApolloProvider client={apolloClient}>
      <ConfigProvider locale={esES}>
        <GlobalContext.Provider
        value={{
          userId,
          setUserId,
          taskDrawerVisible, 
          setTaskDrawerVisible
        }}
        >
          <Calendario/>
        </GlobalContext.Provider>
      </ConfigProvider>
    </ApolloProvider>
  );
}

export default App;
