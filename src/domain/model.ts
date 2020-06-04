export interface AbstractModel {
  uuid?: string;
  created_at: Date;
  updated_at: Date;
}

interface ModelFactory<T extends AbstractModel> {
  (model: AbstractModel): T;
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
