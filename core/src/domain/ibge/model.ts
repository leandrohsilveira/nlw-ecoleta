import { AbstractModel } from "../model";

export interface IbgeUF extends AbstractModel {
  nome: string;
  sigla: string;
}

export interface IbgeMunicipio extends AbstractModel {
  nome: string;
}
