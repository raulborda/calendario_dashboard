import { gql } from "@apollo/client";

export const GET_TAREAS_CALENDARIO = gql`
  query getTareasPropiasMobileResolver($idUsuario: Int) {
    getTareasPropiasMobileResolver(idUsuario: $idUsuario)
  }
`;
