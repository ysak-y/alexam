import * as uuid from "uuid";

export class Device {
  id: string = "deviceID." + uuid.v4();
  private _supportedInterfaces: any = {};

  constructor() {
    this.audioPlayerSupported();
  }

  audioPlayerSupported(obj: { [name: string]: any } = {}) {
    this.supportedInterface("AudioPlayer", obj);
  }

  aplSupported(maxVersion?: string) {
    this.supportedInterface("Alexa.Presentation.APL", {
      runtime: {
        maxVersion: maxVersion ? maxVersion : "1.9",
      },
    });
  }

  videoAppSupported(obj: { [name: string]: any } = {}) {
    this.supportedInterface("VideoApp", obj);
  }

  supportedInterfaces(): any {
    return this._supportedInterfaces;
  }

  private supportedInterface(name: string, obj: { [name: string]: any }) {
    this._supportedInterfaces[name] = obj;
  }
}
