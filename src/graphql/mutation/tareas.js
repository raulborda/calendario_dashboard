const { gql } = require("@apollo/client");

export const UPDATE_ESTADO_TAREA = gql`
  mutation updateEstadoTareaIframeResolver($idTarea: Int) {
    updateEstadoTareaIframeResolver(idTarea: $idTarea)
  }
`;