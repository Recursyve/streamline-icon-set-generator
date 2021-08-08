import * as fs from "fs";
import * as path from "path";

export interface ConfigFile {
    setDestination: string;
    sets: IconSetConfig[];
}

export interface IconSetConfig {
    name: string;
    icons: IconConfig[];
}

export interface IconConfig {
    path: string;
    name: string;
}

export class Config {
    private readonly filePath: string;
    public readonly config: ConfigFile;

    constructor(filePath: string) {
        this.filePath = path.join(process.cwd(), filePath);
        if (!fs.existsSync(this.filePath)) {
            throw Error("No config file found");
        }

        this.config = JSON.parse(fs.readFileSync(this.filePath).toString());
        if (!this.config.sets) {
            this.config.sets = [];
        }
    }

    public setDestination(destination: string): void {
        this.config.setDestination = destination;
        this.saveFile();
    }

    public createIconSet(name: string): void {
        const set = this.config.sets.find((x) => x.name === name);
        if (set) {
            return;
        }

        this.config.sets.push({
            name,
            icons: []
        });
        this.saveFile();
    }

    public addIconToSet(setName: string, icon: string, name: string): void {
        const set = this.config.sets.find((x) => x.name === setName);
        if (!set) {
            return;
        }

        set.icons.push({
            path: icon,
            name
        });
        this.saveFile();
    }

    private saveFile(): void {
        fs.writeFileSync(this.filePath, JSON.stringify(this.config, null, 4));
    }
}
