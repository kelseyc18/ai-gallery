# MIT App Inventor Gallery Redesign

```
# Install dependencies
yarn (or npm install)

# Start development server
yarn dev (or npm run dev)

# Build for production
yarn build (or npm run build)

# Start production server
yarn start (or npm start)
```

## Installation guide

1.  Install [VSCode](https://code.visualstudio.com/)
2.  Install [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
3.  Install [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
4.  Modify the VSCode user settings to add below configuration
    ```javascript
    "eslint.alwaysShowStatus": true,
    "eslint.autoFixOnSave": true,
    "editor.formatOnSave": true,
    "prettier.eslintIntegration": true
    ```
5. Follow the instructions below to setup Login Authentication.
6. If the database has not been populated, run the following two commands:
    ```
    node src/server/populate_database.js setup
    ```
    and
    ```
    node src/server/populate_database.js projects
    ```

## Login Authentication

App Inventor requires a secret key called the ["authkey"](https://docs.google.com/document/pub?id=1Xc9yt02x3BRoq5m1PJHBr81OOv69rEBy8LVG_84j9jc#h.yikyg2e1rfut). As part of setting up App Inventor to run locally on your machine, you should have run
```
ant MakeAuthKey
```
This command creates a directory called `appinventor-sources/appinventor/appengine/build/war/WEB-INF/authkey` with two files: `1` and `meta`. Copy these files into `ai-gallery/src/server/authkey`.
