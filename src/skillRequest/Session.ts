import * as uuid from "uuid";

export class Session {
  attributes: { [id: string]: any };
  new: boolean = true;
  sessionId: string = "amzn1.echo-api.session." + uuid.v4();
  applicationId: string;

  constructor({
    applicationId,
    attributes,
  }: {
    applicationId?: string;
    attributes?: { [id: string]: any };
  }) {
    this.applicationId = applicationId
      ? applicationId
      : "amzn1.echo-api.session." + uuid.v4();
    this.attributes = attributes ? attributes : {};
  }

  toJson() {
    return {
      new: this.new,
      sessionId: this.sessionId,
      application: {
        applicationId: this.applicationId,
      },
      attributes: this.attributes,
    };
  }
}
