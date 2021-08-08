import { Config } from "../utils/config";
import { IconSet } from "../utils/icon-set";

export class NewIconSetCommand {
    constructor(private options: any, private set: string) {}

    public run(): void {
        const config = new Config(this.options.config);
        config.createIconSet(this.set)

        const set = new IconSet(this.set, config);
        set.init();
    }
}
