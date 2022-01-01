From: https://github.com/libertylocked/chrome-extension-typescript-react

# YATM

A Chrome extension tab manager with focus on having low number of tabs.

Shows a counter of currently open tabs, open windows and the number of all-time opened tabs.

Currently published in the Chrome Web Store:

https://chrome.google.com/webstore/detail/chrome-tab-counter/fhnegjjodccfaliddboelcleikbmapik

Copyright (c) 2011-2021 Miroslav Solanka

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

TODO
https://blog.logrocket.com/creating-chrome-extension-react-typescript/

# Chrome Extension TypeScript React Starter Kit

Chrome Extension Starter Kit, for TypeScript and React.

## What is new

Forked from [chibat's original starter kit](https://github.com/chibat/chrome-extension-typescript-starter), this kit essentially adds _React_ support for **popup** and **options** windows.

Plus a bunch of other improvements like source mapping and a better build setup!

---

## Includes the following

- TypeScript
- React
- Webpack
- TSLint
- Moment.js
- jQuery

## Project Structure

- `src`: TypeScript source files
- `public`: Chrome Extension manifest, icon, HTMLs
- `dist`: This is where the Chrome Extension will be built
  - `dist/build`: Generated JavaScript bundles with source mapping, and assets

## Development build

Runs webpack in watch mode, generates bundles with source mapping

```
npm start
```

## Production build

Runs webpack and generates the minified bundles

```
npm run build
```

## Load extension to chrome

- Build the extension
- Open Chrome and go to `chrome://extensions`
- Click `Load unpacked extension...`
- Load the `dist` directory

## Debugging your extension

- Click on the icon of your extension opens the **popup** window
- Right click and open DevTools
- In DevTools you can press Ctrl+R to reload
- Because source maps are generated, you can easily debug your ts code in DevTools
