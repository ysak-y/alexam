import { interfaces } from "ask-sdk-model";
import * as uuid from "uuid";
import { Device } from "./Device";
import { User } from "./User";

/**
 * Data class that represents context property of the request
 * See https://developer.amazon.com/en-US/docs/alexa/custom-skills/request-and-response-json-reference.html#context-object
 */
export class Context {
  apiAccessToken: string = uuid.v4();
  apiEndpoint: string = "https://api.amazonalexa.com";
  applicationId: string;
  device: Device = new Device();
  viewport?: interfaces.viewport.ViewportState;
  user: User;

  constructor({
    user,
    applicationId,
  }: {
    user?: User;
    applicationId?: string;
  }) {
    this.applicationId = applicationId
      ? applicationId
      : "amzn1.ask.skill." + uuid.v4();
    this.user = user ? user : new User();
  }

  /**
   * @internal
   */
  toJson() {
    const json: any = {
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

    if (this.viewport) {
      json.Viewport = this.viewport;
    }

    return json;
  }
}
