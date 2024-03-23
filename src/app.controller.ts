import { ValetudoService } from './valetudo.service';
import { State } from './types';
import { Controller, Get } from '@nestjs/common';
import { XboxControllerService } from './xbox-controller.service';
import {
  interval,
  map,
  mergeMap,
  Observable,
  Subscription,
  switchMap,
} from 'rxjs';
import { stronglyTypedEntries } from './helpers/stronglyTypedEntries';

@Controller()
export class AppController {
  subscription: Subscription;
  clock$ = interval(200);
  state$: Observable<State>;
  /**
   * Keymap:
   *
   * Movement is done via the D-Pad, because that was much easier to implement.
   *
   * Start starts manual control
   * Select stops manual control
   *
   * X stop
   * Y sends the robot back to the dock
   */
  keymap = {
    X: () => this.valetudoService.basicAction('stop'),
    Y: () => this.valetudoService.basicAction('home'),
    Select: () => this.valetudoService.toggle(false),
    Start: () => this.valetudoService.toggle(true),
    Right: () => this.valetudoService.move('rotate_clockwise'),
    Left: () => this.valetudoService.move('rotate_counterclockwise'),
    Up: () => this.valetudoService.move('forward'),
    Down: () => this.valetudoService.move('backward'),
  };

  constructor(
    private readonly valetudoService: ValetudoService,
    private readonly xBoxControllerService: XboxControllerService,
  ) {
    this.xBoxControllerService.init();
    this.state$ = this.xBoxControllerService.controllerState$;
    this.start();
  }

  @Get()
  getHello(): string {
    return 'Hello valetudo-gamepad';
  }

  start() {
    this.subscription = this.state$
      .pipe(
        map((state) => {
          const entries = stronglyTypedEntries(state);
          const apiToCall = entries
            .filter(([, value]) => Boolean(value))
            .filter(([key]) => Object.keys(this.keymap).includes(key))
            .map(([key]) => key);

          console.log('🔊 apiToCall', apiToCall);
          return apiToCall;
        }),
        switchMap((values) => this.clock$.pipe(map(() => values))),
        mergeMap((keys) => keys.map((key) => this.keymap[key]())),
      )
      .subscribe((apiCall) => apiCall.subscribe());
  }

  logControllerState() {
    this.state$.subscribe((state) => console.log('🔊 controller state', state));
  }

  stop() {
    this.subscription.unsubscribe();
  }

  secondSubscription: Subscription;
  /** ChatGPT suggests to use this combination of switchMap() and mergeMap() */
  startSecondAttempt() {
    this.secondSubscription = this.clock$
      .pipe(
        switchMap(() => this.state$),
        mergeMap((state) => {
          const keys = Object.keys(state) as Array<keyof typeof state>; // added by me
          const observables = keys.map((key) =>
            interval(500).pipe(map(() => this.keymap[key]())),
          );
          return observables;
        }),
      )
      .subscribe();
  }

  stopSecondAttempt() {
    this.secondSubscription.unsubscribe();
  }
}
