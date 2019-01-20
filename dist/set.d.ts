import { Locale } from ".";
import * as yarg from 'yargs';
interface setArgs {
    locale?: Locale;
    key?: string;
    value?: string;
    verbose?: boolean;
}
export declare var command: string;
export declare var describe: string;
export declare var builder: (yargs: yarg.Argv<setArgs>) => yarg.Argv<yarg.Omit<setArgs, "verbose"> & {
    verbose: unknown;
}>;
export declare var handler: (argv: setArgs) => void;
export {};
