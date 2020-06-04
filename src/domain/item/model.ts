import createAbstractModel, { AbstractModel } from "../model";

export interface Item extends AbstractModel {
  title: string;
  image: string;
}

export default function createItem(title: string, image: string): Item {
  return createAbstractModel((model) => ({
    ...model,
    title,
    image,
  }));
}
