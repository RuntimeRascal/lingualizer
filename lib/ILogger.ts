interface ILogger
{
    error?( ...params: any[] ): void;
    warn?( ...params: any[] ): void;
    info?( ...params: any[] ): void;
    verbose?( ...params: any[] ): void;
    debug?( ...params: any[] ): void;
    log?( ...params: any[] ): void;
}

export { ILogger };