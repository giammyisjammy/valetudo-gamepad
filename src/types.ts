export type State = {
  Start?: number;
  Select?: number;
  A?: number;
  B?: number;
  X?: number;
  Y?: number;
  L1?: number;
  R1?: number;
  Up?: 0 | 1;
  Right?: 0 | 1;
  Down?: 0 | 1;
  Left?: 0 | 1;
};

/**
 * data is 48-byte Buffer with byte values:
 * index- info
 *  00  - unknown 0x01
 *  01  - unknown 0x00
 *  02  - start, select, dpad digital bitfield (see data[14]-[17] for analog values)
 *  03  - action button, shoulder, triggers digital bitfield (see data[18]-[25] for analog values)
 *  04  - playstation button
 *  05  -
 *  06  - left joystick analog left-right
 *  07  - left joystick analog up-down
 *  08  - right joystick analog left-right
 *  09  - right joystick analog up-down
 *  10,11,12,13 - unknown 0x00
 *  14  - dpad    up analog pressure
 *  15  - dpad right analog pressure
 *  16  - dpad  down analog pressure
 *  17  - dpad  left analog pressure
 *  18  - left  trigger analog pressure
 *  19  - right trigger analog pressure
 *  20  - left  shoulder analog pressure
 *  21  - right shoulder analog pressure
 *  22  - triangle action analog pressure
 *  23  - circle   action analog pressure
 *  24  - X        action analog pressure
 *  25  - square   action analog pressure
 *  26,27,28
 *  29  - charge state
 *  30  - connection type
 *  31,32,33,34,35,36,37,38,39
 *  40,41 - X-axis accelerometer
 *  42,43 - Y-axis accelerometer
 *  44,45 - Z-axis accelerometer
 *  46,47 - Z-axis gyro
 */
export type Data = Buffer;
