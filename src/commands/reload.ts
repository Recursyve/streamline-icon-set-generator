import { Config, IconSetConfig } from "../utils/config";
import { IconSet } from "../utils/icon-set";

export class ReloadIconSetCommand {
    constructor(private options: any, private set?: string) {}

    public run(): void {
        const config = new Config(this.options.config);
        if (this.set) {
            const set = config.config.sets.find((x) => x.name === this.set);
            if (!set) {
                return;
            }
            return this.reloadIconSet(config, set);
        }

        for (const set of config.config.sets) {
            this.reloadIconSet(config, set);
        }
    }

    private reloadIconSet(config: Config, setConfig: IconSetConfig): void {
        const set = new IconSet(setConfig.name, config);
        set.reload(setConfig.icons);
    }
}
