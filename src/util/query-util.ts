import Knex from "knex";

async function count(
  query: Knex.QueryBuilder,
  countItem = "*",
  distinct = false
): Promise<number> {
  let result: { [key: string]: number };
  if (distinct) {
    result = await query.countDistinct(countItem).first();
  } else {
    result = await query.count(countItem).first();
  }
  return Object.keys(result).map((key) => result[key])[0];
}

const queryUtil = {
  count,
};

export default queryUtil;
