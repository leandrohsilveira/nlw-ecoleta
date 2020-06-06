import { AbstractModel } from "../../../model";

export interface Item extends AbstractModel {
  title: string;
  image_url: string;
}
