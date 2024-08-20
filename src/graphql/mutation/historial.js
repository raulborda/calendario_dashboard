import { gql } from "@apollo/client";

export const NEW_HISTORIAL_NEGOCIO = gql`
  mutation newHistorialNegocio($input: historialInput) {
    newHistorialNegocioResolver(input: $input)
  }
`;
