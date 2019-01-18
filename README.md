Look in the `package.json` for repository and author info

*Github* repo: [lingualizer](https://github.com/simpert/lingualizer)
*Github* issues: [lingualizer](https://github.com/simpert/lingualizer/issues)

# Lingualizer
## Installation 
*to install just run*   

> `yarn add lingualizer`  
> or  
> `npm i lingualizer --save`  
> or  
> `bower install lingualizer --save`  

## Test 
*to run the tests just run*   

> `yarn run test`  
> or  
> `npm run test`  

# Configuration
> Lingualizer support common config rc pattern and config in *package.json* as per `yargs` module.  

create a `.lingualizerrc` or `.lingualizerrc.json` file in your project  

``` json
{
    "defaultLocale": "en-US",
    "defaultTranslationFileName": "filenameeee",
    "defaulLocalizationDirName": "loccccdir",
    "defaultTranslationFileExt": "json"
}
```  

example `package.json` configuration
``` json
    "lingualizer":
    {
        "defaultLocale": "en-US",
        "defaultTranslationFileName": "translation",
        "defaulLocalizationDirName": "localization",
        "defaultTranslationFileExt": "json"
    },
```   

to access the configuration please access through the `Lingualizer` class.

``` javascript
var defLocale = Lingualizer.DefaultLocale;
```  

# lingualizer CLI
Once the module has been installed just call into the `cli` tool to set things up in project or to modify translations
`lingualizer`

> make sure that you are in the project root directory when calling into the cli. this directory will be searched recursively for a folder called `localization` and will work with files directly in this directory.

## create
| parameter             | description                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| `--locale` or `-l`    | choose  the culture to create translation file for                                                              |
| `--file-name` or `-f` | if want to create translation file named differently then the default project name then specify a filename here |
| `--based-off` or `-b` | specify a url of a `json` file to download and set contents of newly created file                               |


### Examples
---
*To ensure the `localizations` directory and the a file named after project for translations execute:*  
```
lingualizer create
```    

*To create a new translations file named `MyApp.es-MX.json` execute:*  
```
lingualizer create --locale es-MX --fileName MyApp
```  

### Help
```
lingualizer -h
```    


# Getting started
*a very simple javascript based api to get translated strings from localization files*  
 
The module can be accessed through a singleton so just import the modules and call into the instance.

> the modules is written in `typescript` and includes all definitions so discovering members of the `Lingualizer` class should be pretty easy.

``` javascript
/* import the module's singlton */
import {Lingualizer} from 'lingualizer';

/* set the locale */
Lingualizer.default.setLocale( 'es-MX' );

/* get a localized string */
let okBtnText = Lingualizer.default.get( 'okBtn' );
```

There is a `localeChanged` event that you may subscribe to in order to get notified when the locale changes.

``` javascript
function onLocalChanged( lingualizer, args )
{
    /* get the localized string again and use it */
    let okBtnText = Lingualizer.default.get( 'okBtn' );
}

Lingualizer.default.localeChanged.subscribe( onLocalChanged );
```  