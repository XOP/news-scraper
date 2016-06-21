# NewScraper


## Prerequisites

Application is designed for Node.js, so go ahead and [install](https://nodejs.org/) it.

Also, for easy deployment process it's better to have [surge](http://surge.sh/) installed globally.  
It is not necessary, though. For test scraping and saving results locally you can proceed without it. 



## Install

_Note_: Mind the `postinstall` process!  
It will install [Selenium standalone server](https://www.npmjs.com/package/selenium-standalone). The one is used here for web scraping.

```
$ npm install
```



## Setup

NewScraper utilizes `*.yml` files as parsing directives.  
Source data can be presented in JS or JSON file, 
[YAML](http://docs.ansible.com/ansible/YAMLSyntax.html) is only used for cleaner code.

Example:

```
'CSS tricks':
  url: 'http://css-tricks.com/'
  elem: '#page-wrap .main-col .article-card > h2 > a.read-article'
  limit: 6
```

`'CSS tricks'` - name of the resource  
`url` - source url for the NewScraper
`elem` - CSS selector of the link (<a href="">...</a>) element
`limit` - how many `elem`-s from the `url` will be scraped, maximum



## Up and running

First run the server and let it run in parallel process:

```
$ npm run server
```

Then you have to build the project:

```
$ npm run build
```

After that starting is pretty straightforward:

```
$ npm start
```


### Custom source file

> todo


### Generating index

Some times it's needed to generate or re-generate the index without undergoing the whole fetching process.

Please notice, that `index.html` will overwrite existing file.

```
$ npm run index
```



## Deployment

Deploy process is extremely straightforward.

In `package.json` specify `config > domain` variable.  
After that all you have to do is execute 

```
$ npm run deploy
```

Deployment uses [surge.sh](http://surge.sh/), so you have to be logged in.  
You can do it before deployment or manually by running

```
$ surge login
```



## Configuration

`config.js`

`limit: 3`  
maximum number of links parsed from each resource

`localOnly: true`  
perform scraping using `source/local.yml` data only

`debug: false`  
debug mode results in tons of messages during the process

`silent: false`  
in silent mode there are only errors displayed in console



## Development mode

In this mode Selenium Server Check and Repository Update are skipped.

```
$ npm run build
$ npm run dev
```



## Running tests

Some tests require Selenium server.  
Make sure it is running.

```
$ npm run server
$ npm test
```



## [MIT License](LICENSE)



## Useful links

- [webdriver.io](http://webdriver.io/)
- [Cheerio](http://cheeriojs.github.io/cheerio/)
- [surge.sh](http://surge.sh/)
