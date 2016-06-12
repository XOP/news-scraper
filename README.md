# News scraper



## Install

_Note_: Mind the `postinstall` process

```
$ npm install
```



## Up and running

```
$ npm run server
$ npm run build
$ npm start
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
