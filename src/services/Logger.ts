interface Logger {
  debug(...args: any): void;

  error(...args: any): void;

  warning(...args: any): void;
}

const logger: Logger = new (class implements Logger {
  debug(...args: any) {
    if (process.env.NODE_ENV === 'development') {
      // Usually I do some normalization and enhancement here by map over the args
      const enhancedArgs = args.map((arg: any) => JSON.stringify(arg, null, 2));

      // Call the logFunc with console
      console.log(enhancedArgs);
    }
  }

  error(...args: any) {
    this.debug(args)
  }

  warning(...args: any) {
    this.debug(args)
  }
})();

export { Logger, logger };
