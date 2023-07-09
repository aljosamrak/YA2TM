## README: Project Scripts

This README provides an overview of the following project scripts:

* `create_package_summary.sh`
* `create_version.sh`
* `environment.js`
* `extension_install_test.sh`

### [create_package_summary.sh](create_package_summary.sh)

`create_package_summary.sh` is a shell script that fills manifest description from the `README.md`. It extracts text between two summary comments `<!---Summary-->`.
 
Usage:

```bash
./create_package_summary.sh
```

### [create_version.sh](create_version.sh)

`create_version.sh` is a shell script that extracts version from `package.json`. Appends build number from `CIRCLE_BUILD_NUM` environment variable. It then sets it back to the `package.json` and the `manofest.json`.

Usage:

```bash
./create_version.sh
```

### [environment.js](environment.js)

`environment.js` is a JavaScript file that generates [environment-generated.ts](../src/environments/environment-generated.ts). It generates Git if and Google Analytics ID from `GOOGLE_ANALYTICS_TRACKING_ID` environment variable.

Usage:

```bash
./environment.js'
```

### [extension_install_test.sh](extension_install_test.sh)

`extension_install_test.sh` is a shell script that tests the installation process of the project's browser extension. The script installs the extension in a temporary browser profile, checks for successful installation, and reports any errors encountered during the process.

Usage:

```bash
./extension_install_test.sh
```

Please refer to the individual script files for more detailed information on their functionality and usage. 














