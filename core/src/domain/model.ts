export interface AbstractModel {
  id: number;
}

interface AbstractResult {
  success: boolean;
}

export interface ResultError extends AbstractResult {
  success: false;
  error: {
    message: string;
  };
}

export interface ResultList<T> extends AbstractResult {
  success: true;
  items: T[];
  count: number;
}

export interface Result<T> extends AbstractResult {
  success: true;
  item: T;
}
