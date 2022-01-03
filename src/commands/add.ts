import { Config } from "../utils/config";
import { IconSet } from "../utils/icon-set";

export interface AddIconOptions {
    set: string;
    prefix?: string;
    name?: string;
}

export class AddIconToSetCommand {
    constructor(private options: any, private icon: string, private opts: AddIconOptions) {}

    public run(): void {
        const config = new Config(this.options.config);

        const set = new IconSet(this.opts.set, config);
        const name = set.addIconFromPath(this.icon, this.opts.prefix, this.opts.name);
        config.addIconToSet(this.opts.set, this.icon, name);
    }
}
