import { values as user1 } from "./data/user1";
import { data as user2 } from "./data/users2";
import { data as user3 } from "./data/users3";
import { data as user4 } from "./data/users4";
import { data as user5 } from "./data/users5";
import { data as user6 } from "./data/users6";
import { data as user7 } from "./data/users7";
import { data as user8 } from "./data/users8";
import { data as user9 } from "./data/users9";
import { data as user10 } from "./data/users10";
import { User } from "./models/user";
import {
  DynamicQuery,
  FilterOperator,
  QueryProvider,
  FilterGroupDescriptor,
  FilterCondition,
  SortDirection,
  FilterDescriptor,
  SortDescriptor
} from "ts-dynamic-query";
import * as lodash from "lodash";

const userObjects = user1
  .concat(user2)
  .concat(user3)
  .concat(user4)
  .concat(user5)
  .concat(user6)
  .concat(user7)
  .concat(user8)
  .concat(user9)
  .concat(user10);
const dataStr = JSON.stringify(userObjects);
const users = User.getUsersFromJSON(dataStr);

console.log("total users count: ", users.length);
simpleFilter();
groupFilter();
simpleSort();
serializeDynamicQuery();

for (let i = 0; i < 10; i++) {
  console.log(
    `============================== being test ${i +
      1} =================================`
  );
  compare();
}

function compare(): void {
  const lodashResult = filterByLodash();
  const dynamicQueryResult = filterByDynamicQuery();

  if (lodashResult.length !== dynamicQueryResult.length) {
    console.error("filter results are not equal!");
  }

  for (let i = 0; i < lodashResult.length; i++) {
    const lodashValue = lodashResult[i];
    const dynamicValue = dynamicQueryResult[i];

    if (lodashValue.id !== dynamicValue.id) {
      console.error("item are not equal!");
    }
  }
  console.log("query results are equal");
}

function filterByDynamicQuery(): User[] {
  const startTime = new Date();
  // query link
  const result = new DynamicQuery<User>()
    .addFilter({
      propertyPath: "id",
      operator: FilterOperator.GREATER_THAN,
      value: 200
    })
    .addFilter({
      propertyPath: "id",
      operator: FilterOperator.LESS_THAN_OR_EQUAL,
      value: 900
    })
    .addFilterGroup({
      options: [
        {
          propertyPath: "firstName",
          operator: FilterOperator.START_WITH,
          value: "t",
          ignoreCase: true
        },
        {
          condition: FilterCondition.OR,
          propertyPath: "firstName",
          operator: FilterOperator.START_WITH,
          value: "g",
          ignoreCase: true
        }
      ]
    })
    .addSort({
      propertyPath: "id",
      direction: SortDirection.DESC
    })
    .query(users);

  const endTime = new Date();
  console.log(
    "'DynamicQuery' query time: ",
    endTime.getTime() - startTime.getTime()
  );
  return result;
}

function filterByLodash(): User[] {
  const startTime = new Date();
  let result = lodash.filter(users, u => {
    return (
      u.id > 200 &&
      u.id <= 900 &&
      (u.firstName.toLocaleLowerCase().indexOf("t") === 0 ||
        u.firstName.toLocaleLowerCase().indexOf("g") === 0)
    );
  });
  result = lodash.orderBy(result, "id", "desc");
  const endTime = new Date();

  console.log("'lodash' query time: ", endTime.getTime() - startTime.getTime());
  return result;
}

function simpleFilter(): void {
  console.log("================== simpleFilter start =================");
  // query user where id is 20;
  const idFilter = new FilterDescriptor<User>({
    propertyPath: "id",
    operator: FilterOperator.EQUAL,
    value: 20
  });

  const query = new DynamicQuery<User>().addFilters(idFilter);
  const result = QueryProvider.query(users, query);
  if (result.length !== 1) {
    console.error("should only get one item");
    return;
  }

  if (result[0].id !== 20) {
    console.error("id should 20");
    return;
  }
  console.log("test 'simpleFilter' pass");
  console.log("================== simpleFilter end =================");
}

function groupFilter(): void {
  console.log("================== groupFilter start =================");
  const idGreaterFilter = new FilterDescriptor<User>({
    propertyPath: "id",
    operator: FilterOperator.GREATER_THAN_OR_EQUAL,
    value: 9900
  });

  const idLessFilter = new FilterDescriptor<User>({
    condition: FilterCondition.OR,
    propertyPath: "id",
    operator: FilterOperator.LESS_THAN_OR_EQUAL,
    value: 100
  });

  const idGroupFilter = new FilterGroupDescriptor<User>();
  // put two filters into one group
  idGroupFilter.addFilters(idGreaterFilter, idLessFilter);

  const firstNameFilter = new FilterDescriptor<User>({
    propertyPath: "firstName",
    operator: FilterOperator.START_WITH,
    value: "Al",
    ignoreCase: true
  });

  // like SQL Query:  (user.id >= 9900 OR user.id <= 100) AND user.firstName like 'l%'
  const query = new DynamicQuery<User>().addFilters(
    idGroupFilter,
    firstNameFilter
  );

  const result = QueryProvider.query(users, query);
  console.log("================== group end =================");
}

function simpleSort(): void {
  console.log("================== simpleSort start =================");
  const idSort = new SortDescriptor<User>({
    propertyPath: "id",
    direction: SortDirection.DESC
  });

  const query = new DynamicQuery<User>();
  query.addSorts(idSort);

  const result = QueryProvider.query(users, query);

  const maxId = lodash.max(lodash.map(users, x => x.id));
  if (result[0].id !== maxId) {
    console.error("id should be maxid");
    return;
  }

  console.log("================== simpleSort end =================");
}

function serializeDynamicQuery() {
  console.log(
    "================== serializeDynamicQuery start ================="
  );
  const query = new DynamicQuery<User>()
    .addFilter({
      propertyPath: "id",
      operator: FilterOperator.GREATER_THAN,
      value: 200
    })
    .addFilter({
      propertyPath: "id",
      operator: FilterOperator.LESS_THAN_OR_EQUAL,
      value: 900
    })
    .addFilterGroup({
      options: [
        {
          propertyPath: "firstName",
          operator: FilterOperator.START_WITH,
          value: "t",
          ignoreCase: true
        },
        {
          condition: FilterCondition.OR,
          propertyPath: "firstName",
          operator: FilterOperator.START_WITH,
          value: "g",
          ignoreCase: true
        }
      ]
    })
    .addSort({
      propertyPath: "id",
      direction: SortDirection.DESC
    });

  const queryJSON = query.toJSON();
  console.log("queryJSON: ", queryJSON);
  console.log("================== serializeDynamicQuery end =================");
}
