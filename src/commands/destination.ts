import { Config } from "../utils/config";

export class SetDestinationCommand {
    constructor(private options: any, private destination: string) {}

    public run(): void {
        const config = new Config(this.options.config);
        config.setDestination(this.destination)
    }
}
