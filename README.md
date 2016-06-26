# NewScraper

> Why?

I have a decent number of favourite sites that regularly publish new interesting articles  
and I'm too lazy (or better say _love to automate_) to check all of them manually.

> How does it work?

NewScraper goes to the specified urls, fetches the defined links, brings them back and displays on one page.  
Optionally, it can deploy it to some hosting.  
All you need to do from here is to look through the titles and decide whether to check it out or ditch it.

> Any special skills required?

JS maps understanding, basic knowledge of browser dev tools ([Chrome Dev Tools](https://developers.google.com/web/tools/chrome-devtools/), for instance) and CSS selectors are highly preferable. 

> What does it look like?

Daily digital digest, manually (for now) controlled.



## Support

:warning: NewScraper is being designed for the handful of platforms, however so far there are some [issues](https://github.com/XOP/news-scraper/issues/1) with full Windows support.



## Prerequisites

NewScraper is designed for Node.js, so go ahead and [install](https://nodejs.org/) it.

Next - install latest [Java SDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html).

Make sure it is present in the `$PATH`.

And check the following:

```
$ java -version     # build 1.8...
$ javac -version    # build 1.8...
```

Also, for easy deployment process it's better to have [surge](http://surge.sh/) installed globally.  
It is not necessary, though. For test scraping and saving results locally you can proceed without it. 



## Install

No big surprise here:

```
$ npm install
```

_Note_: Mind the `postinstall` process!  
It will install [Selenium standalone server](https://www.npmjs.com/package/selenium-standalone). The one is used here for web scraping.



## Setup

NewScraper utilizes source files as the _parsing directives_.  
Source data can be presented in JSON or [YAML](http://docs.ansible.com/ansible/YAMLSyntax.html) files, choose whatever suits your needs.

`*.yml` example:

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


### Generating index

Some times it's needed to generate or re-generate the index without undergoing the whole fetching process.

Please notice, that any existing `index.html` in target folder will be overwritten.

```
$ npm run index
```



## Deployment

Deployment uses [surge.sh](http://surge.sh/), so you have to be logged in.  
To do this, run the following:

```
$ surge login
```

Then you have to customize local `.env` file.  
Simply rename the `.env-example` and correct `SURGE_DOMAIN` variable.

After this procedure you will be able to deploy to your domain with one command:

```
$ npm run deploy
```



## Configuration

`config.js`

`limit: 3`  
maximum number of links parsed from each resource

`localOnly: true`  
perform scraping using `source/local.yml` data only

`silent: false`  
in silent mode there are only errors displayed in console



## Development mode

In this mode Selenium Server Check and Repository Update are skipped.

```
$ npm run build
$ npm run dev
```


### Debug

Debug mode is the development mode with DEBUG flag.  
It results in multiple helpful data output throughout the process.

```
$ npm run build
$ npm run debug
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
- [surge.sh](http://surge.sh/)
