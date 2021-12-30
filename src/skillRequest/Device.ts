import * as uuid from "uuid";

export class Device {
  id: string = "deviceID." + uuid.v4();
  private _supportedInterfaces: any = {};

  public constructor() {
    this.audioPlayerSupported(true);
  }

  public audioPlayerSupported(value?: boolean): boolean {
    return this.supportedInterface("AudioPlayer", value);
  }

  public displaySupported(value?: boolean): boolean {
    return this.supportedInterface("Display", value);
  }

  public videoAppSupported(value?: boolean) {
    return this.supportedInterface("VideoApp", value);
  }

  public supportedInterfaces(): any {
    return this._supportedInterfaces;
  }

  private supportedInterface(name: string, value?: boolean): boolean {
    if (value !== undefined) {
      if (value === true) {
        this._supportedInterfaces[name] = {};
      } else {
        delete this._supportedInterfaces[name];
      }
    }
    return this._supportedInterfaces[name] !== undefined;
  }
}
