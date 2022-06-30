# js-runner

Run and schedule repeated execution of javascript files in the NodeJS vm.

The program will watch a folder and try to run any scripts in it in their own virtualization context. A new clean context will be created upon each execution, but there are certain persistent objects that can be used to store values between runs (See *Script context* section).


## Config
---
The config is stored in `jsrunner.ini` in the root folder and is read on program startup.
```ini
[paths]
scriptdir=./scripts #Path to the scripts root folder
log=./jsrunner.log  #Path to log file
```


## Scripts
------
Any .js files located in the `scriptdir` folder or any subfolders will be parsed and executed.

Files will by default be parsed and run as soon as they are added or changed.


## Script context
The following objects will always be available in the script context:
* **logger**: A logging tool that will output the provided message to the logfile (default `./jsrunner.log`) and to the start page of the app (under *LIVE LOG*).

  The available methods are `info`, `warn` and `error`.
  
  Example:
  ```javascript
  logger.warn('Something seems off!');
  ```
  
* **mem**: The *mem* object can be used to store data between executions for repeating scripts.

   Example:
   ```javascript
   mem.myValue = Date.now();
   ```

* **global**: Similar to the *mem* object, but shared between all running scripts.

  Example:
  ```javascript
  global.anyScriptCanReadThis = 'Hello';
  ```


## Script settings
A JSON config file can be provided alongside the script file (ex `testscript.json` for `testscript.js`), where some script settings can be provided. The default values will be used if no settings are provided.
### **Available settings:**
Parameter | Type | Default value | Description
--- | --- | :---: | ---
enabled | Boolean | true
runImmediately | Boolean | true
repeatDelay | Number | 0 | Delay in milliseconds between repeated executions. Will not repeat when 0.
nodeAPI | String[] | [] | Array containing NodeJS API:s used by the script.
packages | String[] | [] | NPM packages used by the script.


**nodeAPI**

nodeAPI consists of an array with NodeJS apis that will be added to the scripts context. These can then be reached directly from the script:

```json
nodeAPI: ["crypto"]`
```

```javascript
const someValue = crypto.randomUUID();
```

See NodeJS [API docs](https://nodejs.org/en/docs/) for documentation.


**packages**

The packages array contain names of NPM packages that will be added to the scripts context. These will be added to the `npm` object in the script.

```json
packages: ["mongoose", "redis"]
```
```javascript
const mongoose = npm['mongoose'];
const { createClient } = npm['redis'];
```
> Note: The npm packages need to be installed on the system, either globally or locally. Local installs need to be located in the same folder as js-runner or a parent folder. 


### **Example config:**
```json
{
  "enabled": true,
  "runImmediately": false,
  "repeatDelay": 10000,
  "nodeAPI": ["crypto", "https"],
  "packages": [
    "nanoid",
    "@stdlib/random-base-mt19937"
  ]
}

```
