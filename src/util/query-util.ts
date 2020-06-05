import Knex from "knex";

async function count(query: Knex.QueryBuilder): Promise<number> {
  const [{ "count(*)": result }] = await query.count();
  return result;
}

const queryUtil = {
  count,
};

export default queryUtil;
