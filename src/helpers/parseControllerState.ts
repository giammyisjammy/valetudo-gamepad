import { Data, State } from '../types';

/**
 * This is a very poor and hacked function to fetch the keypresses from the raw HID events.
 * Feel free to extend it so that it actually becomes a proper parse.
 */
export function parseControllerState(data: Data) {
  const state: State = {};

  state.Start = (data[10] >> 7) & 1;
  state.Select = (data[10] >> 6) & 1;

  state.A = data[10] & 1;
  state.B = (data[10] >> 1) & 1;
  state.X = (data[10] >> 2) & 1;
  state.Y = (data[10] >> 3) & 1;
  state.L1 = (data[10] >> 4) & 1;
  state.R1 = (data[10] >> 5) & 1;

  switch (data[11]) {
    case 0:
      state.Up = 0;
      state.Right = 0;
      state.Down = 0;
      state.Left = 0;
      break;
    case 4:
      state.Up = 1;
      state.Right = 0;
      state.Down = 0;
      state.Left = 0;
      break;
    case 8:
      state.Up = 1;
      state.Right = 1;
      state.Down = 0;
      state.Left = 0;
      break;
    case 12:
      state.Up = 0;
      state.Right = 1;
      state.Down = 0;
      state.Left = 0;
      break;
    case 16:
      state.Up = 0;
      state.Right = 1;
      state.Down = 1;
      state.Left = 0;
      break;
    case 20:
      state.Up = 0;
      state.Right = 0;
      state.Down = 1;
      state.Left = 0;
      break;
    case 24:
      state.Up = 0;
      state.Right = 0;
      state.Down = 1;
      state.Left = 1;
      break;
    case 28:
      state.Up = 0;
      state.Right = 0;
      state.Down = 0;
      state.Left = 1;
      break;
    case 32:
      state.Up = 1;
      state.Right = 0;
      state.Down = 0;
      state.Left = 1;
      break;
  }

  return state;
}

export type DS4State = ReturnType<typeof parseDS4HIDData>;

// Buffer -> DS4State
export function parseDS4HIDData(buf: Data) {
  var dPad = buf[5] & 15;
  return {
    leftAnalogX: buf[1],
    leftAnalogY: buf[2],
    rightAnalogX: buf[3],
    rightAnalogY: buf[4],
    l2Analog: buf[8],
    r2Analog: buf[9],

    dPadUp: dPad === 0 || dPad === 1 || dPad === 7,
    dPadRight: dPad === 1 || dPad === 2 || dPad === 3,
    dPadDown: dPad === 3 || dPad === 4 || dPad === 5,
    dPadLeft: dPad === 5 || dPad === 6 || dPad === 7,

    cross: (buf[5] & 32) !== 0,
    circle: (buf[5] & 64) !== 0,
    square: (buf[5] & 16) !== 0,
    triangle: (buf[5] & 128) !== 0,

    l1: (buf[6] & 0x01) !== 0,
    l2: (buf[6] & 0x04) !== 0,
    r1: (buf[6] & 0x02) !== 0,
    r2: (buf[6] & 0x08) !== 0,
    l3: (buf[6] & 0x40) !== 0,
    r3: (buf[6] & 0x80) !== 0,

    share: (buf[6] & 0x10) !== 0,
    options: (buf[6] & 0x20) !== 0,
    trackPadButton: (buf[7] & 2) !== 0,
    psButton: (buf[7] & 1) !== 0,

    // ACCEL/GYRO
    // motionY: buf.readInt16LE(13),
    // motionX: -buf.readInt16LE(15),
    // motionZ: -buf.readInt16LE(17),

    // orientationRoll: -buf.readInt16LE(19),
    // orientationYaw: buf.readInt16LE(21),
    // orientationPitch: buf.readInt16LE(23),

    // TRACKPAD
    trackPadTouch0Id: buf[35] & 0x7f,
    trackPadTouch0Active: buf[35] >> 7 === 0,
    trackPadTouch0X: ((buf[37] & 0x0f) << 8) | buf[36],
    trackPadTouch0Y: (buf[38] << 4) | ((buf[37] & 0xf0) >> 4),

    trackPadTouch1Id: buf[39] & 0x7f,
    trackPadTouch1Active: buf[39] >> 7 === 0,
    trackPadTouch1X: ((buf[41] & 0x0f) << 8) | buf[40],
    trackPadTouch1Y: (buf[42] << 4) | ((buf[41] & 0xf0) >> 4),

    timestamp: buf[7] >> 2,
    //battery: buf[12],
    //batteryShort1: buf[12] & 0x0f,
    //batteryShort2: buf[12] & 0xf0,
    batteryLevel: buf[12],
  };
}
