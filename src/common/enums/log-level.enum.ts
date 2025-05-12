export enum LogLevel {
  /**
   * Trace: for very detailed debugging information.
   * Typically used for logging entry/exit of functions, variables, etc.
   * Numeric level: 10
   */
  Trace = 'trace',

  /**
   * Debug: for general debugging information.
   * Useful during development to inspect flow and state.
   * Numeric level: 20
   */
  Debug = 'debug',

  /**
   * Info: for high-level operational messages.
   * Indicates normal but significant events (e.g., server start/stop).
   * Numeric level: 30
   */
  Info = 'info',

  /**
   * Warn: for situations that are unusual or potentially problematic,
   * but the application is still running as expected.
   * Numeric level: 40
   */
  Warn = 'warn',

  /**
   * Error: for errors that prevented an operation or request from completing.
   * Indicates a failure in the current execution path.
   * Numeric level: 50
   */
  Error = 'error',

  /**
   * Fatal: for very severe errors that lead to application shutdown.
   * Indicates unrecoverable conditions.
   * Numeric level: 60
   */
  Fatal = 'fatal',
}
