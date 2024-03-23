import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, tap } from 'rxjs';
import { VALETUDO_HOST } from 'src/constants';

@Injectable()
export class ValetudoService {
  private readonly paths = {
    capabilities: `${VALETUDO_HOST}/api/v2/robot/capabilities`,
  };
  private readonly logger = new Logger(ValetudoService.name);
  constructor(private readonly httpService: HttpService) {}

  toggle(enabled: boolean) {
    return this.manualControlCapability({
      action: enabled === true ? 'enable' : 'disable',
    });
  }

  basicAction(action: BasicControlAction['action']) {
    return this.basicControlCapability({ action });
  }

  move(movementCommand: MoveAction['movementCommand']) {
    return this.manualControlCapability({
      action: 'move',
      movementCommand,
    });
  }

  private basicControlCapability(action: BasicControlAction) {
    return this.httpService
      .put(`${this.paths.capabilities}/BasicControlCapability`, action)
      .pipe(this.logError());
  }

  private manualControlCapability(action: ManualControlAction) {
    return this.httpService
      .put(`${this.paths.capabilities}/ManualControlCapability`, action)
      .pipe(this.logError());
  }

  private logError() {
    return catchError((error: AxiosError) => {
      this.logger.error(error.response.data);
      throw 'An error happened!';
    });
  }
}

type BasicControlAction = {
  action: 'start' | 'stop' | 'pause' | 'home';
};

type MoveAction = {
  action: 'move';
  movementCommand:
    | 'forward'
    | 'backward'
    | 'rotate_clockwise'
    | 'rotate_counterclockwise';
};
type ToggleAction = {
  action: 'enable' | 'disable';
};
type ManualControlAction = ToggleAction | MoveAction;
