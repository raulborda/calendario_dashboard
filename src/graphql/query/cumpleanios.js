import { gql } from "@apollo/client";

export const GET_CUMPLEANIOS_CALENDARIO = gql`
  query getCumpleanios($fechaNac:String){
    getCumpleaniosResolver(fechaNac:$fechaNac)
  }
`;




