export interface AbstractModel {
  id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface AbstractJson {
  id?: number;
}

interface ErrorJson {
  message: string;
}

interface AbstractResultJson {
  success: boolean;
}

export interface PersistenceSingleResultJson<T extends AbstractJson>
  extends AbstractResultJson {
  success: true;
  item: T;
}

export interface PersistenceResultListJson<T extends AbstractJson>
  extends AbstractResultJson {
  success: true;
  items: T[];
}

export interface ErrorResultJson extends AbstractResultJson {
  success: false;
  error: ErrorJson;
}

interface ModelFactory<T extends AbstractModel> {
  (model: AbstractModel): T;
}

interface JsonFactory<T extends AbstractJson> {
  (json: AbstractJson): T;
}

export function serializeAbstractJson<
  M extends AbstractModel,
  J extends AbstractJson
>(model: M, factory: JsonFactory<J>): J {
  return factory({
    id: model.id,
  });
}

export function serializePersistenceResult<T extends AbstractJson>(
  success: boolean,
  obj: T | T[] | ErrorJson
):
  | PersistenceSingleResultJson<T>
  | PersistenceResultListJson<T>
  | ErrorResultJson {
  if (success) {
    if (Array.isArray(obj)) {
      return {
        success,
        items: obj as T[],
      };
    } else {
      return {
        success,
        item: obj as T,
      };
    }
  } else {
    return {
      success,
      error: obj as ErrorJson,
    };
  }
}

export default function createAbstractModel<T extends AbstractModel>(
  factory: ModelFactory<T>
): T {
  const now = new Date();
  return factory({
    created_at: now,
    updated_at: now,
  });
}
