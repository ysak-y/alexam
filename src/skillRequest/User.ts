import * as uuid from "uuid";

export class User {
  id: string = "amzn1.ask.account." + uuid.v4();
  accessToken?: string;

  linkAccount() {
    this.accessToken = uuid.v4();
  }
}
