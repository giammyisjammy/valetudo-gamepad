import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { XboxControllerService } from './xbox-controller.service';
import { ValetudoService } from './valetudo.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [XboxControllerService, ValetudoService],
})
export class AppModule {}
