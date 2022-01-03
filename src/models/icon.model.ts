import { create } from "xmlbuilder2";
import { XMLBuilder } from "xmlbuilder2/lib/interfaces";

export class Icon {
    public data: XMLBuilder

    constructor(data: string, public name: string, public style?: string) {
        data = data.replace(/#\d\d\d\d\d\d/g, "currentColor");
        this.data = create(data);
    }
}
