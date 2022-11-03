# Lab Inventory

An inventory website, created for the Jackson Reed robotics lab.

## Libraries

### [Bulma](https://bulma.io/)

Bulma is a CSS framework, in some ways similar to Boostrap, intended to make it easier to build the UI. The docs can be found at [bulma.io/documentation](https://bulma.io/documentation/). Bulma has no JavaScript dependencies.

### [Sass](https://sass-lang.com/)

Sass is a 'CSS preprocessor.' This basically means that you can write modified pseudo-CSS with additional features, and sass will compile it into normal, minfied CSS. Some notable features it includes are nested selectors, functions, and mixins. The docs are at [sass-lang.com/documentation](https://sass-lang.com/documentation/).

To be able to compile with Sass, you need to have it installed on your system. You can install it from npm with `npm install -g sass`. If you use VSCode, there are two included build scripts which you can run with `Ctrl+Shift+B`: `Compile Sass` and `Watch Sass`. `Compile Sass` compiles the `.scss` files once, and `Watch Sass` runs the same command but with `--watch`, so sass will watch for changes and compile as you code. These scripts can be found in [`.vscode/tasks.json`](.vscode/tasks.json)

If you don't use VSCode, you can just copy the commands from `tasks.json` and run them in your terminal, or set up your own build system.

### [Sortable](https://github.com/HubSpot/sortable)

Sortable is a tiny (`<2kb`) drop-in script for creating sortable tables. It doesn't have much of an API, but for what there is, there are docs at [github.hubspot.com/sortable](https://github.hubspot.com/sortable/api/options/).

