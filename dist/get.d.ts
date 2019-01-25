import { IArgV } from "./common";
export declare var command: string;
export declare var describe: string;
export declare var builder: (yargs: any) => any;
export declare function handler(argv: IArgV): Promise<any>;
