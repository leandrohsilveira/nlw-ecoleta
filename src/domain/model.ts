export interface AbstractModel {
  id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface AbstractJson {
  id?: number;
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

export default function createAbstractModel<T extends AbstractModel>(
  factory: ModelFactory<T>
): T {
  const now = new Date();
  return factory({
    created_at: now,
    updated_at: now,
  });
}
