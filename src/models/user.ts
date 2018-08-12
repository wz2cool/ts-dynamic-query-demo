import { deserializeArray } from "class-transformer";

export class User {
  id: number;
  avatar: string;
  county: string;
  email: string;
  title: string;
  firstName: string;
  lastName: string;
  street: string;
  zipCode: string;
  date: string;
  bs: string;
  catchPhrase: string;
  companyName: string;
  words: string;
  sentence: string;

  public static getUsersFromJSON(json: string): User[] {
    return deserializeArray<User>(User, json);
  }
}
