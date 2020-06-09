import { AbstractModel } from "../model";
import { Item } from "../item/model";

interface AbstractPoint {
  name: string;
  image: string;
  email: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  uf: string;
  city: string;
}

export interface Point extends AbstractPoint {
  items: number[];
}

export interface PointModel extends AbstractModel, AbstractPoint {}

export interface PointDetailModel extends AbstractModel, AbstractPoint {
  items: Item[];
}
