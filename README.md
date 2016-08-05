# LandCarbon CDI Web Application

### Features

&nbsp; &nbsp; ✓ Javascript is bundled and optimized with [Webpack](http://webpack.github.io/)<br>
&nbsp; &nbsp; ✓ Development web server with [Webpack](http://www.browsersync.io)<br>
&nbsp; &nbsp; ✓ Javascript code follows [Airbnb Style Guide](https://github.com/airbnb/javascript). <br>
&nbsp; &nbsp; ✓ To setup SublimeText3 and eslint see [this](http://sublimelinter.readthedocs.io/en/latest/)<br>


### Directory Layout

```
.
├── /node_modules/            # 3rd-party libraries and utilities
├── /public/                  # The folder for compiled output
├── /src/                     # Source
│   ├── /images/              # Images
│   ├── /components/          # Javascript components
│   └── /style/               # CSS stylesheets
│── webpack.config.js         # Webpack configuration
│── package.json              # Dev dependencies and NPM scripts
└── README.md                 # Project overview
```

### Getting Started

Install node and npm on your computer. This setup is tested on node v0.12.13 and npm v0.12.13. Then clone the repo from github, cd into project directory and install node modules. Run `npm run dev` to start the webpack dev server. 

```
$ git clone https://github.com/berkeley-gif/landcarbon-cdi-webapp
$ cd landcarbon-cdi-webapp
$ npm install
$ npm run dev
```

Then open [http://localhost:8080/](http://localhost:8080/) in your browser.

Webpack's Hot Module Replacement (HMR) watches for any changes made to javascript or css files or html partials inside the components directory and refreshes the browser automatically. Any changes made to index.html are not caught by HMR, you will need to refresh browser window manually to see changes.



### How to Build and Deploy

```shell
$ npm run build               # Builds the project
$          # Deploy the project to production site
```

