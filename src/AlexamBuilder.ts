import { RequestEnvelope, ResponseEnvelope } from "ask-sdk-model";
import { Alexam } from "./Alexam";

export type LambdaFunction = (event: any, context: any, callback: any) => any;
export type Function = (request: RequestEnvelope) => any;

export class LambdaHandler implements Handler {
  handlerFunction: LambdaFunction;

  constructor(handlerFunction: LambdaFunction) {
    this.handlerFunction = handlerFunction;
  }

  async handle(request: RequestEnvelope): Promise<any> {
    return this.handlerFunction(request, {}, {});
  }
}

export class BaseHandler implements Handler {
  handlerFunction: Function;

  constructor(handlerFunction: Function) {
    this.handlerFunction = handlerFunction;
  }

  async handle(request: RequestEnvelope): Promise<any> {
    return this.handlerFunction(request);
  }
}

export interface Handler {
  handlerFunction: LambdaFunction | Function;
  handle(request: RequestEnvelope): Promise<ResponseEnvelope>;
}

export class AlexamBuilder {
  private _handler?: Handler;

  setHandler(handler: Handler) {
    this._handler = handler;
    return this;
  }

  setInteractionModel() {}

  build(): Alexam {
    return new Alexam(this._handler);
  }
}
