interface createArgs {
    locale?: string;
    fileName?: string;
    basedOff?: string;
    force?: boolean;
    verbose?: boolean;
}
export declare var command: string;
export declare var describe: string;
export declare var builder: (yargs: any) => any;
export declare var handler: (argv: createArgs) => Promise<void>;
export {};
