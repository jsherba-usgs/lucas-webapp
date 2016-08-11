# LandCarbon CDI Web Application

Prototype app visualizing. 

### Features

&nbsp; &nbsp; ✓ Javascript is bundled and optimized with [Webpack 2](http://webpack.github.io/) and [Babel](https://babeljs.io/)<br>
&nbsp; &nbsp; ✓ Development web server with Webpack 2<br>
&nbsp; &nbsp; ✓ Javascript code follows [Airbnb Style Guide](https://github.com/airbnb/javascript).<br>
&nbsp; &nbsp; ✓ To setup SublimeText3 and eslint see [this](http://sublimelinter.readthedocs.io/en/latest/)<br>

Make sure you have the latest node before using Webpack 2. Some depenencies may fail in older versions. This setup is known to work with Node v6.2.2 and npm v3.9.5.


### Setup

```
$ npm install
```


### Running

```
$ npm start
```

Then open [http://localhost:3000/](http://localhost:3000/) in your browser.

Webpack's Dev Server watches for any changes made to javascript, css or html partials inside the components directory and refreshes the browser automatically. Any changes made to index.html are not caught by dev server, you will need to refresh browser window manually to see changes.


### Build

```
$ npm run build
```

This creates a new directory `build` or updates it if directory already exists. This directory can then be deployed to server.


### Directory Layout

```
.
├── /node_modules/            # 3rd-party libraries and utilities
├── /build/                   # Compiled output directory
├── /src/                     # Source directory
│   ├── /images/              # Images
│   ├── /components/          # Javascript components
│   ├── /style/               # CSS stylesheets
│   └── index.html            # 
│── .babelrc                  # Settings for Babel
│── .eslintrc                 # Settings for ESLint
│── build.js                  # Cross-platform build script
│── package.json              # Dev dependencies and NPM scripts
│── webpack.config.js         # Webpack configuration
└── README.md                 # Project overview
```



