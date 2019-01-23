import * as yarg from 'yargs';
import { IArgV } from "./common";
export declare var command: string;
export declare var describe: string;
export declare var builder: (yargs: yarg.Argv<IArgV>) => yarg.Argv<yarg.Omit<IArgV, "verbose"> & {
    verbose: unknown;
}>;
export declare var handler: (argv: IArgV) => Promise<void>;
