import { values } from "./data";
import { User } from "./models/user";
import { DynamicQuery, FilterOperator, QueryProvider } from "ts-dynamic-query";

const dataStr = JSON.stringify(values);
const users = User.getUsersFromJSON(dataStr);

filterUserIdGreaterThan500();

function filterUserIdGreaterThan500() {
  console.log("total users count: ", users.length);
  const query = new DynamicQuery<User>().addFilter({
    propertyPath: "id",
    operator: FilterOperator.GREATER_THAN,
    value: 500
  });

  const result = QueryProvider.query(users, query);
  console.log("after filter user count: ", result.length);
}
