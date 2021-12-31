export interface IntentRequest {
  type: "IntentRequest";
  intent: {
    name: string;
  };
  slots?: any;
}
