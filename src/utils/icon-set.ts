import * as fs from "fs";
import * as path from "path";
import { create } from "xmlbuilder2";
import { XMLSerializedAsObject } from "xmlbuilder2/lib/interfaces";
import { Icon } from "../models/icon.model";
import { Config, IconConfig } from "./config";

export class IconSet {
    constructor(private name: string, private config: Config) {}

    public init(): void {
        if (fs.existsSync(path.join(this.config.config.setDestination, `${this.name}-icons.svg`))) {
            return;
        }
        fs.copyFileSync(path.join(__dirname, "../../icon-set.svg"), path.join(this.config.config.setDestination, `${this.name}-icons.svg`));
    }

    public reset(): void {
        fs.copyFileSync(path.join(__dirname, "../../icon-set.svg"), path.join(this.config.config.setDestination, `${this.name}-icons.svg`));
    }

    public addIconFromPath(iconPath: string, prefix?: string, name?: string): string {
        const icon = this.findIcon(iconPath);
        return this.addIcon(icon, prefix, name);
    }

    public addIcon(icon: Icon, prefix?: string, name?: string): string {
        const file = fs.readFileSync(path.join(this.config.config.setDestination, `${this.name}-icons.svg`)).toString();
        const doc = create(file);

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
        const iconName = prefix ? `${prefix}-${name ?? icon.name}` : name ?? icon.name;
        icon.data.first().att("id", iconName);

        const currentIcon = defsTag.find((node) => {
            const obj = node.toObject();
            return ((obj as XMLSerializedAsObject)["svg"] as XMLSerializedAsObject)["@id"] === iconName;
        });
        if (currentIcon) {
            currentIcon.each((node) => node.remove());
            icon.data.first().each((node) => currentIcon.import(node));
        } else {
            defsTag.import(icon.data);
        }

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
            this.addIconFromPath(icon.path, undefined, icon.name);
        }
    }

    private findIcon(iconPath: string): Icon {
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

        return new Icon(icon, name, style);
    }
}
