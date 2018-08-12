import { values } from "./data";
import { User } from "./models/user";

const dataStr = JSON.stringify(values);
const users = User.getUsersFromJSON(dataStr);

console.log(users.length);

function filterStudent() {}
