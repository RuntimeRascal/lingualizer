import * as yarg from 'yargs';
interface getArgs {
    locale?: string;
    key?: string;
    verbose?: string;
}
export declare var command: string;
export declare var describe: string;
export declare var builder: (yargs: yarg.Argv<getArgs>) => yarg.Argv<yarg.Omit<getArgs, "verbose"> & {
    verbose: unknown;
}>;
export declare var handler: (argv: getArgs) => void;
export {};
