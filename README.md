*Github* repo: [lingualizer](https://github.com/simpert/lingualizer)
*Github* issues: [lingualizer](https://github.com/simpert/lingualizer/issues)

# Lingualizer
*A simple api for getting translated strings based on a locale and a command line tool for createing translation files and managing the translated strings*  

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
> Lingualizer support common rc config pattern and config in *package.json* as per `yargs` module.  

create a `.lingualizerrc` or `.lingualizerrc.json` file in your project  
``` json
{
    "defaultLocale": "en-US",
    "defaultTranslationFileName": "filenameeee",
    "defaulLocalizationDirName": "loccccdir",
    "defaultTranslationFileExt": "json"
}
```  

create a `lingualizer` node in the `package.json` configuration
``` json
    "lingualizer":
    {
        "defaultLocale": "en-US",
        "defaultTranslationFileName": "translation",
        "defaulLocalizationDirName": "localization",
        "defaultTranslationFileExt": "json"
    },
```   

settings in the configuration are loaded right away and can be accessed through the `Lingualizer` class  
``` javascript
var defLocale = Lingualizer.DefaultLocale; // get the defaut locale
```  

# lingualizer CLI
Once the module has been installed just call into the `cli` tool to set things up in project or to modify translations

> make sure that you are in the project root directory when calling into the cli. this directory will be searched recursively for a folder called `localization` [or defaulLocalizationDirName from config] and will work with files directly in this directory.

## create
> If you have allready some translation files with ***key*** ***value*** pairs you can create a new translation file and base it off of. Just specify a url to the `json` file with the `--based-off` parameter.  


| parameter             | description                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `--locale` or `-l`    | choose  the culture to create translation file for                                                                             |
| `--file-name` or `-f` | **[obsolete]** if want to create translation file named differently then the default project name then specify a filename here |
| `--based-off` or `-b` | specify a url of a `json` file to download and set contents of newly created file                                              |
| `--force`             | if the file allready exists then overwrite it                                                                                  |

### Examples
---
``` javascript
    // will create localization directory if needed and default local with default contents
    // the file name will not have locale in name as default locale is used
    // the file name will be in format '<project-name>.json'
    create

    // the file name will not have 'es-MX' in name if default locale is same */
    // the file name will be in format '<project-name>.es-MX.json' */
    // will create localization directory if needed and locale es-MX with default contents */
    create --locale es-MX

    // will create localization directory if needed and default locale file with contents from url */
    // the file name will not have locale in name as default locale is used */
    // the file name will be in format '<project-name>.json' */
    create --based-off "https://raw.githubusercontent.com/simpert/lingualizer/master/test/data.json"

    // will create localization directory if needed and default local with default contents */
    // the file name will not have locale in name as default locale is used */
    // the file name will be in format 'translation.json' */
    create --file-name 'translation'

    // will create localization directory if needed and default local with default contents */
    // the file name will not have locale in name as default locale is used */
    // the file name will be in format 'translation.es-MX.json' */
    create --locale es-MX --file-name 'translation'

    // will create localization directory if needed and default local with default contents */
    // if the file allready existed then it will be overwritten */
    // the file name will be in format '<project-name>.json' */
    create --force
```

## set
> use the `set` command to create new key value pairs in a translation file and to update allready existing values  

| parameter                              | description                                                                                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--key` or `-k`  or *first*            | the key to set tag the trasnalted text                                                                                                           |
| `--value` or `-val` or `v` or *second* | the translated text to assign to the `key`                                                                                                       |
| `--locale` or `-l`                     | the locale to determine which file to add translation to. this is an *optional* parameter if if not specified the default locale will be assumed |

### Examples
---
``` javascript
    // explicit
    set --key <key> --value <value> --locale es-MX
    set -k <key> -v <value> -l es-MX
   
    // implicit and assume default culture
    set into "hello"

    // implicit specify locale
    set into "hello" -l es-MX
```


## get
> use to get the **value** of a **key** from either the default `locale` if non provided or a certain locale.

**The file name as of right now for the `get` command will be searched for using the settings file default filename or if no settings file will use the default of looking up name of the project directory**

### Examples
``` javascript
    // get all translations from default locale
    get

    // get all translations from 'es-MX'
    get --locale es-MX

    // get translation named 'ok' from default locale
    get ok
    
    // get translation named 'ok' from 'es-MX' locale
    get ok es-MX

    // get translation named 'ok' from 'es-MX' locale
    get ok --locale es-MX

    // get translation named 'ok' from 'es-MX' locale
    get --key ok --locale es-MX
```

### Help
```
lingualizer --help
lingualizer create --help
lingualizer get --help
lingualizer set --help
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
    let okBtnText = lingualizer.get( 'okBtn' );
}

Lingualizer.default.localeChanged.subscribe( onLocalChanged );
```  