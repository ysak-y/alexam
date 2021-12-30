import { Handler } from "./Handler";
import { RequestEnvelope } from "ask-sdk-model";

export class Alexam {
  handler: Handler;

  constructor(handler: Handler) {
    this.handler = handler;
  }

  //async utter(text: string) {}

  async send(request: RequestEnvelope) {
    return this.handler.handle(request);
  }
}
