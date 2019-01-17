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

# lingualizer CLI
Once the module has been installed just call into the `cli` tool to set things up in project or to modify translations
`lingualizer`

> make sure that you are in the project root directory when calling into the cli. this directory will be searched recursively for a folder called `localization` and will work with files directly in this directory.

## create
- locale : choose  the culture to create translation file for
- fileName: if want to create translation file named differently then the default project name then specify a filename here
- basedOff: specify a url of a `json` file to download and set contents of newly created file


#### examples
To ensure the `localizations` directory and the a file named after project for translations execute:  
`create`  

To create a new translations file named `MyApp.es-MX.json` execute:  
`create --locale es-MX --fileName MyApp`  

### Help
`lingualizer -h`  


Getting started

1. first create a folder named `localization` in your project's root.
2. now create a file called `<translations|projectFolderName>.json` for default culture or `<translations|projectFolderName>.es-mx.json` for a translated file.

