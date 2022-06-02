import axios from "axios";
import extract from "extract-zip";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as util from "util";
import { Icon } from "../models/icon.model";
import { StreamlineCategories } from "../models/streamline-categories.model";
import { Config } from "../utils/config";
import { IconSet } from "../utils/icon-set";

const rm = util.promisify(fs.rm);
const readdir = util.promisify(fs.readdir);

export interface ImportIconOptions {
    set: string;
    path: string;
    prefix?: string;
    override?: boolean;
}

export class ImportIconToSetCommand {
    constructor(private options: any, private _path: string, private opts: ImportIconOptions) {}

    public async run(): Promise<void> {
        const config = new Config(this.options.config);

        const set = new IconSet(this.opts.set, config);
        if (this.opts.override) {
            set.reset();
        }

        const dir = path.join(process.cwd(), `${Date.now()}-icons`);
        try {
            await extract(this.path, { dir });
        } catch (e) {
            console.log(e);
        }

        const files = await readdir(dir);
        const categories = await this.getFamiliesCategories(set.config?.families ?? []);
        for (const file of files) {
            const iconData = fs.readFileSync(path.join(dir, file)).toString();

            /**
             * Deconstruct name to get the icon name
             * The name looks like this: streamlinehq-add-circle-interface-essential-48-ico_mRu4pQJ4vpxL2aEJttqmIC6A.SVG
             * We want the first part without streamlinehq- -- (add-circle)
             */
            const nameValues = file.split("-48-ico_");

            const category = categories.find((x) => nameValues[0].endsWith(x.slug));
            if (!category) {
                return;
            }

            const iconName = nameValues[0].replace("streamlinehq-", "").replace(`-${category.slug}`, "");
            const icon = new Icon(iconData, iconName);
            set.addIcon(icon, this.opts.prefix);
        }

        await rm(dir, { recursive: true, force: true });
    }

    private get path(): string {
        if (path.isAbsolute(this._path)) {
            return this._path;
        }

        if (this._path.startsWith("~/")) {
            return path.join(os.homedir(), this._path.replace("~", ""));
        }

        return this._path;
    }

    private async getFamiliesCategories(families: string[]): Promise<StreamlineCategories[]> {
        const categories = [];
        for (const family of families) {
            const res = await axios.get(`https://api.streamlinehq.com/v3/families/${family}/categories`);
            if (!res.data?.success) {
                continue;
            }

            categories.push(...(res.data.categories ?? []));
        }
        return categories;
    }
}
