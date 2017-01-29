# NewScraper

> IMPORTANT!

Current version is work in progress, documentation is not up-to-date.  
If you want to try stable working example, check out [latest release](https://github.com/XOP/news-scraper/releases/tag/0.10.0) and follow installation instructions. 

> Why?

I have a decent number of favourite sites that regularly publish new interesting articles  
and I'm too lazy (or better say _love to automate_) to check all of them manually.

> How does it work?

NewScraper goes to the specified urls, fetches the defined links, brings them back and displays on one page.  
Optionally, it can deploy it to some hosting.  
All you need to do from here is to look through the titles and decide whether to check it out or ditch it.

> Any special skills required?

Basic knowledge of JS, browser dev tools ([Chrome Dev Tools](https://developers.google.com/web/tools/chrome-devtools/), for instance) and CSS selectors are highly preferable.  

If you are more of a user than of a developer, then this current manual should cover almost everything necessary.

> What does it look like?

Daily digital digest, manually (for now) controlled.

> Anything else I should know?

Yes! NewScraper involves powers of [Nightmare](http://www.nightmarejs.org/) for the web-scrawling purposes.



## Support

:warning: NewScraper is being designed for the handful of platforms, however so far there are some [issues](https://github.com/XOP/news-scraper/issues/1) with full Windows support.



## Prerequisites

NewScraper is designed for Node.js, so go ahead and [install](https://nodejs.org/) it.

For easy deployment process it's better to have [surge](http://surge.sh/) installed globally.  
It is not necessary, though. For test scraping and saving results locally you can proceed without it. 



## Install

No big surprise here:

```
$ npm install
```



## Setup

NewScraper utilizes source files as the _parsing directives_.  
Source data can be presented in JSON or [YAML](http://docs.ansible.com/ansible/YAMLSyntax.html) files, choose whatever suits your needs.

`*.yml` example:

```
'Smashing magazine':
  url: 'http://www.smashingmagazine.com/'
  elem: 'article.post'
  link: 'h2 > a'
  author: 'h2 + ul li.a a'
  time: 'h2 + ul li.rd'
  image: 'figure > a > img'
  limit: 6
```

Properties explained:

`'Smashing magazine'`  
name of the resource, **required**  

`url`  
source url for the NewScraper, **required**  

`elem`  
CSS selector of the news item container element, **required**  

`link`  
CSS selector of the link (<a href="">...</a>) _inside_ of the `elem`  
If the `elem` itself _is_ a link, this is not required

`author`  
CSS selector of the author element _inside_ of the `elem`

`time`  
CSS selector of the time element _inside_ of the `elem`

`image`  
CSS selector of the image element _inside_ of the `elem`  
This one can be `img` tag or any other - scraper will search for `data-src` and `background-image` CSS properties to find proper image data

`limit`  
how many `elem`-s from the `url` will be scraped, maximum


### Adding directives

There are several ways to add (custom) directives.


#### Git repository

Create a git repository, similar to [this](https://github.com/XOP/my-favourite-front-end-resources). There you can add files with desired resources in YAML or JSON format - take [scraper.yml](https://github.com/XOP/my-favourite-front-end-resources/blob/master/scraper.yml) as an example. Then specify the properties of the repo in `config.js` and you are good to go.


#### Custom files 

Second option is to manually create directives files (YAML or JSON format) and put them into the `/source` directory. Then adjust the `config.js` so scraper would know what directives to use.


#### Adding dialog

Dialog option is probably the simplest way to test something relatively quick.

All you need to do is run

```
$ npm run add
```

and follow the prompts.  
The result will be stored in the `custom.json` file in the `/source` directory and utilized in scraping procedure.

By default, `custom.json` is used as the source file, so there is no need to tweak `config.js`.



## Up and running

First you have to build the project.  
This has to be done **only once**, unless you are making changes in the `/src` directory:

```
$ npm run build
```

After that starting is pretty straightforward:

```
$ npm start
```

and go to `http://localhost:9000`.


### Generating index

Sometimes it's needed to generate or re-generate the index without undergoing the whole fetching process.

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

Then you have to customize local settings. To do this simply rename `user-example.json` to `user.json` and edit existing config.

After this procedure you will be able to deploy to your domain with one command:

```
$ npm run deploy
```


### Adjusting the deploy

By default deploy covers the whole directory (specified in config as `output.path`), which implies a lot of generated JSON data.  
To take care of that inconvenience create the `.surgeignore` file with the following content:

```
*.json
```

and make sure to store it **inside the deployed folder** (specified in config as `output.path`) - "data" by default. 

You can find a sample `.surgeignore` file in the project root.



## Configuration

Persistent configuration is stored in the `config.js`.  
It can be tweaked, though there is a better way to tweak settings.

For various everyday needs there is a `user.json` file at your service.  
It basically _overrides_ config settings.

Here are all the config parameters:
```
{
    // directives' parameters
    source: {
        // folder for all directives
        path: '/source',
        
        // array of local directives' names
        // empty array means no local directives being used
        file: ['local.yml']
    },
    
    // repository parameters
    repo: {
        name: 'my-favourite-front-end-resources',
        path: 'https://github.com/XOP/my-favourite-front-end-resources',
        
        // array of directives' names in repository
        // empty array means no repo directives being used
        file: []
    },
    
    // results parameters
    output: {
        // folder for the output data and rendered html
        path: '/data',
        
        // properties for the rendered html file name
        fileName: '',
        fileDate: true,
        fileExt: 'html',
        
        // keeps last scraping run data (applies to compare update strategy)
        current: 'data.json'
    },
    
    // here are the assets for the deployed site being kept - css etc.
    assets: {
        path: '/assets'
    },
    
    // array of acceptable directives formats
    sourceFormats: ['json', 'yml'],
    
    // maximum number of news parsed from each resource
    limit: 3,
    
    // the most maximum number of news scraped from each resource
    absLimit: 50,
    
    // determines if only local directives are being used
    localOnly: false,
    
    // prevents verbose output to console and reports errors only
    silent: false,
    
    // possible options: scratch | compare
    // scratch - each following scraping round ignores previous results
    // compare - each following scraping round brings only news since last run
    updateStrategy: 'scratch'
}
```

Thus said, here is the possible configuration of the `user.json` (create one from the [corresponding sample file](user-example.json)):

```
{
    "surgeDomain": "xop-news-scraper.surge.sh",

    "localOnly": false,

    "repo": {
        "file": [
            "news-rus.yml"
        ]
    },

    "source": {
        "file": []
    }
}
```



## Development mode

In this mode Repository Update is skipped.

```
$ npm run build
$ npm run dev
```


### Debug

:construction::construction::construction:



## Running tests

```
$ npm run build
$ npm test
```



## Dependencies

- [NewScraper Core](https://www.npmjs.com/package/news-scraper-core)



## [MIT License](LICENSE)



## Useful links

- [Nightmare](http://www.nightmarejs.org/)
- [cheerio](https://github.com/cheeriojs/cheerio)
- [surge.sh](http://surge.sh/)
