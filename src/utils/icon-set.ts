import * as fs from "fs";
import * as path from "path";
import { create } from "xmlbuilder2";
import { XMLBuilder } from "xmlbuilder2/lib/interfaces";
import { Config, IconConfig } from "./config";

export class IconSet {
    constructor(private name: string, private config: Config) {}

    public init(): void {
        if (fs.existsSync(path.join(this.config.config.setDestination, `${this.name}-icons.svg`))) {
            return;
        }
        fs.copyFileSync(path.join(__dirname, "../../icon-set.svg"), path.join(this.config.config.setDestination, `${this.name}-icons.svg`));
    }

    public addIcon(iconPath: string, prefix?: string, name?: string): string {
        const file = fs.readFileSync(path.join(this.config.config.setDestination, `${this.name}-icons.svg`)).toString();
        const doc = create(file);

        const [icon, style, originalName] = this.findIcon(iconPath);

        /**
         * Skip comment and select <svg>
         */
        const svgTag = doc.first().next();

        /**
         * Select <defs>
         */
        const defsTag = svgTag.first();

        /**
         * Add icon the <defs>
         */
        const iconName = prefix ? `${prefix}-${name ?? originalName}` : name ?? originalName;
        icon.first().att("id", iconName);
        defsTag.import(icon);

        const xml = doc.end({ prettyPrint: true, indent: "    ", headless: true });
        fs.writeFileSync(path.join(this.config.config.setDestination, `${this.name}-icons.svg`), xml);
        return iconName;
    }

    public reload(icons: IconConfig[]): void {
        const filePath = path.join(this.config.config.setDestination, `${this.name}-icons.svg`)
        if (fs.existsSync(filePath)) {
            fs.rmSync(filePath);
        }

        this.init();
        for (const icon of icons) {
            this.addIcon(icon.path, undefined, icon.name);
        }
    }

    private findIcon(iconPath: string): [XMLBuilder, string, string] {
        const streamlinePath = path.join(process.cwd(), "node_modules/@streamlinehq/streamlinehq/img", iconPath);
        if (!fs.existsSync(streamlinePath)) {
            throw new Error("Icon not found");
        }

        const icon = fs.readFileSync(streamlinePath).toString();
        const pathElements = iconPath.split("/");

        /**
         * First pathElement is the streamline icon style
         * We remove "streamline-" from the name
         */
        const style = pathElements[0].replace("streamline-", "");

        /**
         * Last pathElement os the icon svg file name
         * We remove ".svg" from the name
         */
        const name = pathElements[pathElements.length - 1].replace(".svg", "");

        return [create(icon), style, name];
    }
}
