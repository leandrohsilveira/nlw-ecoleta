import Knex from "knex";
import { Transaction } from "knex";

export interface ConnectionFactory {
  (): Knex;
}

export interface TableConnectionFactory {
  (trx?: Transaction): Knex.QueryBuilder;
}

export interface TransactionFactory {
  (): Promise<Knex.Transaction>;
}

export function createTableConnectionFactory(
  connectionFactory: ConnectionFactory,
  tableName: string
): TableConnectionFactory {
  return (trx) => (trx ?? connectionFactory())(tableName);
}

export function createTransactionFactory(
  connectionFactory: ConnectionFactory
): TransactionFactory {
  return () => connectionFactory().transaction();
}
