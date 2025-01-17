import { LoggerService } from '@nestjs/common';
import { Logtail } from '@logtail/node';

const logtail = new Logtail(process.env.LOGTAIL_TOKEN);
export class LogtailLogger implements LoggerService {
  log(message: any) {
    logtail.log(message);
  }
  error(message: any, trace: string) {
    logtail.error(message, { trace });
  }
  warn(message: any) {
    logtail.warn(message);
  }
  debug(message: any) {
    logtail.debug(message);
  }
  // verbose(message: any) {
  //   logtail.verbos(message);
  // }
}
