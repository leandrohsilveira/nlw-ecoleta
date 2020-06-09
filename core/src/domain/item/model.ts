import { AbstractModel } from "../model";

export interface Item extends AbstractModel {
  title: string;
  // eslint-disable-next-line camelcase
  image_url: string;
}
