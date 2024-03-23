import { usb } from 'usb';
import * as HID from 'node-hid';
import { Injectable, Logger } from '@nestjs/common';
import { fromEvent, map, Observable } from 'rxjs';
import { VENDOR_ID, PRODUCT_ID } from 'src/constants';
import {
  DS4State,
  parseControllerState,
  parseDS4HIDData,
} from 'src/helpers/parseControllerState';
import { State } from 'src/types';

@Injectable()
export class XboxControllerService {
  private readonly logger = new Logger(XboxControllerService.name);

  device: HID.HID = null;
  controllerState$: Observable<State>;
  improvedControllerState$: Observable<DS4State>;

  constructor() {
    // Attaches a callback to plugging in a device.
    usb.on('attach', this.init);

    // Attaches a callback to unplugging a device.
    usb.on('detach', this.cleanup);

    // noble.on('stateChange', (state) =>
    //   console.log('[noble] stateChange', state),
    // );
    // noble.on('scanStart', () => console.log('[noble] stateChange'));
    // noble.on('scanStop', () => console.log('[noble] scanStop'));
    // noble.on('discover', (peripheral) =>
    //   console.log('[noble] discover', peripheral),
    // );
  }

  init(device?: usb.Device) {
    console.log('[USB] on.attach', device);
    try {
      this.device = new HID.HID(VENDOR_ID, PRODUCT_ID);
      this.controllerState$ = fromEvent(this.device, 'data').pipe(
        map(parseControllerState),
      );
      this.improvedControllerState$ = fromEvent(this.device, 'data').pipe(
        map(parseDS4HIDData),
      );
      // this.improvedControllerState$.subscribe((state) =>
      //   console.log('🔊 state', state),
      // );
    } catch (error) {
      console.error(error);
    }
  }

  pause() {
    this.device.pause();
  }

  resume() {
    this.device.resume();
  }
  //
  devices() {
    return HID.devices();
  }

  cleanup(device?: usb.Device) {
    console.log('[USB] on.detach', device);
    this.device.close();
    this.device = null;
    this.controllerState$ = null; // is this right?
  }
}
