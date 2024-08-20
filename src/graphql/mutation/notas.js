import { gql } from "@apollo/client";

export const NEW_NOTA = gql`
  mutation newNota($input: notaInput, $idNegocio: Int, $idUsuario: Int) {
    newNotaResolver(input: $input, idNegocio: $idNegocio, idUsuario: $idUsuario)
  }
`;
