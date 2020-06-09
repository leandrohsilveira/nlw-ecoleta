export interface AbstractModel {
  id: number;
}

export interface ResultList<T> {
  success: boolean;
  items: T[];
  count: number;
}
