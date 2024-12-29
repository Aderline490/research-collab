import { Injectable, Logger, LogLevel } from '@nestjs/common';

@Injectable()
export class CustomLoggerService extends Logger {
  private readonly logLevels: LogLevel[] = ['log', 'error', 'warn', 'debug', 'verbose'];

  constructor(context?: string) {
    super(context);
  }

  log(message: string, context?: string) {
    super.log(message, context || this.context);
    this.logToFile('log', message, context);
  }

  error(message: string, trace?: string, context?: string) {
    super.error(message, trace, context || this.context);
    this.logToFile('error', message, context, trace);
  }

  warn(message: string, context?: string) {
    super.warn(message, context || this.context);
    this.logToFile('warn', message, context);
  }

  debug(message: string, context?: string) {
    if (this.isLevelEnabled('debug')) {
      super.debug(message, context || this.context);
      this.logToFile('debug', message, context);
    }
  }

  verbose(message: string, context?: string) {
    if (this.isLevelEnabled('verbose')) {
      super.verbose(message, context || this.context);
      this.logToFile('verbose', message, context);
    }
  }

  private logToFile(level: LogLevel, message: string, context?: string, trace?: string) {
    const fs = require('fs');
    const logMessage = `[${new Date().toISOString()}] [${level.toUpperCase()}] [${
      context || this.context
    }] ${message} ${trace ? `\nTrace: ${trace}` : ''}\n`;
    fs.appendFileSync('application.log', logMessage, { encoding: 'utf8' });
  }

  private isLevelEnabled(level: LogLevel): boolean {
    return this.logLevels.includes(level);
  }
}
