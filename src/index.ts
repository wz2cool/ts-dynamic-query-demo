import { values } from "./data";
import { User } from "./models/user";
import {
  DynamicQuery,
  FilterOperator,
  QueryProvider,
  FilterGroupDescriptor,
  FilterCondition
} from "ts-dynamic-query";

const dataStr = JSON.stringify(values);
const users = User.getUsersFromJSON(dataStr);

filterUserIdGreaterThan500();

function filterUserIdGreaterThan500() {
  console.log("total users count: ", users.length);

  const query = new DynamicQuery<User>()
    .addFilter({
      propertyPath: "id",
      operator: FilterOperator.GREATER_THAN,
      value: 500
    })
    .addFilter({
      propertyPath: "id",
      operator: FilterOperator.LESS_THAN_OR_EQUAL,
      value: 800
    })
    .addFilterGroup({
      options: [
        {
          propertyPath: "firstName",
          operator: FilterOperator.START_WITH,
          value: "th",
          ignoreCase: true
        },
        {
          condition: FilterCondition.OR,
          propertyPath: "firstName",
          operator: FilterOperator.START_WITH,
          value: "go",
          ignoreCase: true
        }
      ]
    });

  const result = QueryProvider.query(users, query);
  console.log("after filter user count: ", JSON.stringify(result));
}
