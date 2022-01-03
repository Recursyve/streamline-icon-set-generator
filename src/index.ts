#!/usr/bin/env node

import { Command } from "commander";
import { AddIconOptions, AddIconToSetCommand } from "./commands/add";
import { SetDestinationCommand } from "./commands/destination";
import { ImportIconOptions, ImportIconToSetCommand } from "./commands/import";
import { NewIconSetCommand } from "./commands/new";
import { ReloadIconSetCommand } from "./commands/reload";

const bootstrap = () => {
    const program = new Command();

    program
        .version(require("../package.json").version, "-v, --version", "Output the current version")
        .option("-c, --config <config>", "Path to the icon set config file", "streamlinehq.json")
        .helpOption('-h, --help', "Output usage information.");

    program
        .command("destination [dest]")
        .description("Set icon destination")
        .action((dest: string) => new SetDestinationCommand(program.opts(), dest).run());

    program
        .command("new [set]")
        .description("Create a new icon set")
        .action((set: string) => new NewIconSetCommand(program.opts(), set).run());

    program
        .command("add [icon]")
        .description("Add an icon to an icon set")
        .requiredOption("-s, --set [set]", "Icon set to add the icon to")
        .option("-p, --prefix [prefix]", "Add a prefix to the icon name")
        .option("-n, --name [name]", "Override icon name")
        .action((icon: string, options: AddIconOptions) => new AddIconToSetCommand(program.opts(), icon, options).run());

    program
        .command("import [path]")
        .description("Import icons to an icon set")
        .requiredOption("-s, --set [set]", "Icon set to add the icon to")
        .option("-p, --prefix [prefix]", "Add a prefix to the icon name")
        .action((path: string, options: ImportIconOptions) => new ImportIconToSetCommand(program.opts(), path, options).run());

    program
        .command("reload [set]")
        .description("Reload the icon sets from config")
        .action((set?: string) => new ReloadIconSetCommand(program.opts(), set).run());

    program.parse(process.argv);
};

bootstrap();
