# Hitachi SIM Portal

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Overview

Hitachi SIM Portal is a React-based web application. It uses modern tooling including Webpack, Babel, TypeScript, and integrates with MUI for UI components. The project structure supports demos, custom configuration, and optimized builds for deployment.

## Project Structure

- **src/**: Main application source code (React, TypeScript, CSS, assets).
- **public/**: Static files served directly (HTML, favicon, manifest).
- **build/**: Production build output.
- **config/**: Custom configuration for Webpack, environment, and paths.
- **scripts/**: Node scripts for building, starting, and testing the app.
- **demos/**: Demo packages and examples.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.  
The page reloads on edits and shows lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.  
See [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for details.

### `npm run build`

Builds the app for production to the `build` folder.  
It bundles React in production mode and optimizes the build for best performance.  
The build is minified and filenames include hashes for cache busting.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**  
Copies configuration files and dependencies into your project for full control.

## Environment Variables

- `NODE_ENV`: Set to `development`, `production`, or `test`.
- `PUBLIC_URL`: Used for referencing static assets in HTML and JS.
- See [`src/react-app-env.d.ts`](src/react-app-env.d.ts) for TypeScript environment typings.

## Deployment

The app is ready to be deployed after running `npm run build`.  
See [deployment documentation](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

- [Create React App Documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React Documentation](https://reactjs.org/)

---

For custom configuration, see files in [config/](config/).  
For demo examples, see [demos/](demos/).
