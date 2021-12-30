import * as uuid from "uuid";
import { Device } from "./Device";
import { User } from "./User";

export class Context {
  apiAccessToken: string = uuid.v4();
  apiEndpoint: string = "https://api.amazonalexa.com";
  applicationId: string;
  device: Device = new Device();
  user: User;

  constructor(applicationId: string, user: User) {
    this.applicationId = applicationId;
    this.user = user;
  }

  toJson() {
    return {
      System: {
        application: {
          applicationId: this.applicationId,
        },
        device: {
          deviceId: this.device.id,
          supportedInterfaces: this.device.supportedInterfaces(),
        },
        user: {
          userId: this.user.id,
          accessToken: this.user.accessToken,
        },
        accessToken: this.user.accessToken,
        apiEndpoint: this.apiEndpoint,
        apiAccessToken: this.apiAccessToken,
      },
    };
  }
}
