import { values as user1 } from "./data/user1";
import { data as user2 } from "./data/users2";
import { data as user3 } from "./data/users3";
import { data as user4 } from "./data/users4";
import { data as user5 } from "./data/users5";
import { User } from "./models/user";
import {
  DynamicQuery,
  FilterOperator,
  QueryProvider,
  FilterGroupDescriptor,
  FilterCondition
} from "ts-dynamic-query";
import * as lodash from "lodash";

const userObjects = user1
  .concat(user2)
  .concat(user3)
  .concat(user4)
  .concat(user5);
const dataStr = JSON.stringify(userObjects);
const users = User.getUsersFromJSON(dataStr);

for (let i = 0; i < 3; i++) {
  filterUserIdGreaterThan500();
}

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

  const startTime = new Date();
  const result = QueryProvider.query(users, query);
  const endTime = new Date();

  console.log("after filter user count: ", result.length);
  console.log("total: ", endTime.getTime() - startTime.getTime());

  const lodashStartTime = new Date();
  const lodashResult = lodash.filter(users, u => {
    return (
      u.id > 500 &&
      u.id <= 800 &&
      (u.firstName.toLocaleLowerCase().indexOf("th") === 0 ||
        u.firstName.toLocaleLowerCase().indexOf("go") === 0)
    );
  });

  console.log("lodash after filter user count: ", lodashResult.length);
  const lodashEndTime = new Date();

  console.log(
    "lodash total: ",
    lodashEndTime.getTime() - lodashStartTime.getTime()
  );
}
