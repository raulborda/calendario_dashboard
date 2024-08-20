import { gql } from "@apollo/client";

export const GET_NEGOCIO_CONTENT = gql`
  query getNegocioContent(
    $idNegocio: Int
    $idHistorialNegocio: Int
    $idNegocioPorcentaje: Int
    $idNegocioTimeline: Int
    $estadoTarea: Int
  ) {
    getDealContentIframeResolver(idNegocio: $idNegocio)
    getHistorialByNegocioResolver(idNegocio: $idHistorialNegocio) {
      his_id
      neg_id
      eta_id
      his_fechaupdate
      his_detalle
      usu_id
      his_fechaprevia
      his_etaprevia
      usu_nombre
      tiempoEtaPrevia
      tiempoEtaActual
      tiempo
    }
    tiposTareasCantidadResolver(idNegocio: $idNegocioPorcentaje) {
      tip_id
      tip_desc
      cantidadTipoTarea
      porcentajeTipoTarea
    }
    getTimeLineByNegocioResolver(
      idNegocio: $idNegocioTimeline
      estadoTarea: $estadoTarea
    )
  }
`;
