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

## Mobile View

Because many people will be using the site on their phones, it's important that the site also be responsive and usable on mobile. There are multiple ways to preview the site from the perspective of a phone to make sure that everything works.

<details>
<summary><h3>In-Browser</h3></summary>

Both Chrome(/Chromium) and Firefox have built-in features to do this:

#### Chromium

To enable the 'Device Toolbar' in chrome, you need to open developer tools and click the phone icon in the top left, next to the 'Select Element' button. You can achieve the same effect by pressing <kbd>Ctrl+Shift+M</kbd>.

#### Firefox

To enable 'Responsive Design Mode' in Firefox, you need to open developer tools and click the phone icon in the top right, next to the close button and the meatball menu. You can achieve the same effect by pressing <kbd>Ctrl+Shift+M</kbd>.

#### Both

Once you have opened the Device Toolbar, you can resize the viewport using the handles on the sides, or set the pixel values with the toolbar on the top.

Instead of a mouse, you can control the site as if you were using a phone (this works especially well on a touch-screen device like a school laptop). In Firefox, you need to enable this by clicking the 'Enable Touch Simulation' button on the touch simulation toolbar.

Using the toolbar, you can also select a specific device to emulate, set the zoom level, and enable network throttling.

To exit out, just click the close button in the top right.

</details>

<details>
<summary><h3>External</h3></summary>

To make sure that the site is working *exactly* how it's supposed to, and to cut out any potential inconsistencies with the browser's emulation, you can also just load the site on your phone. To do this, the computer running the site *and* the phone will need to be on the same wifi network. Because of the way the school's network operates, this might not work on school wifi.

First, start up your server of choice (like the VSCode Live Server extension) on the computer. Then, you need to find the computers' IP address. You can do that using the following command, for each operating system respectively:

**Windows**:

```cmd
ipconfig /all | findstr IPv4
```

Or, in Powershell:

```powershell
Get-NetIPAddress | select AddressFamily,IPAddress
```

In both of these, look for the `IPv4` fields (and ignore `127.0.0.1`).

**Mac/Linux**:

```sh
ifconfig | grep "inet "
```

Ignore `127.0.0.1`.

Once you've found the right IP address, just open it as a URL in your device, with the port of the server at the end of the URL (like `http://x.x.x.x:1234`).

</details>
