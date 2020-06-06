import { createIbgeApi } from "../../../util/api";
import { IbgeUF, IbgeMunicipio } from "../model";

async function findAllUfs(orderBy: keyof IbgeUF = "nome"): Promise<IbgeUF[]> {
  const response = await createIbgeApi().get<IbgeUF[]>(
    `/localidades/estados?orderBy=${orderBy}`
  );
  return response.data;
}

async function findAllMunicipiosByUf(
  uf: string | number,
  orderBy: keyof IbgeMunicipio = "nome"
): Promise<IbgeMunicipio[]> {
  const response = await createIbgeApi().get<IbgeMunicipio[]>(
    `/localidades/estados/${uf}/municipios?orderBy=${orderBy}`
  );
  return response.data;
}

const ibgeService = {
  findAllUfs,
  findAllMunicipiosByUf,
};

export default ibgeService;
