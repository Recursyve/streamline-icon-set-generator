# Streamline Icons SVG set generator

This is a CLI that generates icon sets for [Streamline Icons](https://streamlinehq.com). It was design to be used with the SVG Icons of [Angular Material](https://material.angular.io/components/icon/overview#svg-icons).

## Installation

```
$ npm i --save-dev @recursyve/streamline-icon-set-generator
```

## Usage

By default, the CLI configuration is save in the streamlinehq.json file. The only required config is `setDestination`. It tells the CLI where to save the icon sets.

```json
{
    "families": [],
    "secret": "",
    "setDestination": "src/assets/icons"
}
```

### Create an icon set

This will initalize an icon set and save the file in the set destination directory.

```
$ streamline new my-icon-set
```

This will generation a file named my-icon-set.svg

### Add an icon to a set

This will search for an icon in the `@streamlinehq/streamlinehq` packages and add it to the icon set

```
$ streamline add --set my-icon-set streamline-regular/interface-essential/home/house.svg
```
