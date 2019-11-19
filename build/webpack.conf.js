const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PlaceAssetsPlugin = require('html-webpack-place-assets-plugin');
const HappyPack = require('happypack');

const getStyleLoaders = require('./style-loader').getStyleLoaders;
const findEntry = require('./find-entry');
const defines = require('../config/fe/define.conf');
const publicConf = require('../config/fe/public.conf');

const isProduction = process.env.NODE_ENV === 'production';

// context path
const contextPath = path.resolve(__dirname, '../fe/');

// extract css
let extractCss = isProduction ?
  new ExtractTextPlugin('static/css/[name].[hash].css') :
  new ExtractTextPlugin('static/css/[name].css')

// styleLoaders: css, less, sass, stylus, postcss
let styleLoaders = getStyleLoaders({
  extractPlugin: isProduction ? extractCss : null,
  happyList: ['less'],
  postcssOptions: { 
    config: {
      path: path.resolve(__dirname, './postcss.config.js')
    }
  },
  lessOptions: {
    strictMath: 'off'
  }
});

// cache loader options
let cacheLoaderOptions = {
  loader: 'cache-loader',
  options: {
    cacheDirectory: path.resolve(__dirname, '../.cache-loader')
  }
}

// babelLoaderOptions
let babelLoaderOptions = {
  loader: 'babel-loader',
  options: {
    'babelrc': false,
    'presets': [
      // 'react',
      ['env', {
        'targets': {
          'browsers': ['> 1%', 'ie > 9']
        },
        useBuiltIns: true
      }],
      'stage-2',
      'stage-3',
    ],
    'plugins': []
    // 'plugins': [].concat(
    //   // react hot loader
    //   isProduction ? [] : 'react-hot-loader/babel'
    // )
  }
}

// hot reload entry
let hotReloadEntry = [
  `webpack-hot-middleware/client?reload=false&path=${publicConf.publicPath}__webpack_hmr`,
  // 'react-hot-loader/patch',
];

// entrys
let entryConfigs = findEntry({
  // contextDir
  contextPath: contextPath,
  // entryDir
  entryDirs: [
    path.resolve(contextPath, 'src/entry/'),
    path.resolve(contextPath, 'src/h5/entry/')
  ],
  // group the entry files
  group(p) {
    return 'main';
  },
  // template for entry js
  template(p) {
    if (p.indexOf('h5/entry/') != -1) {
      return p.replace(/.*src\/h5\/entry\/(.*)\.(js|jsx)$/, 'src/h5/html/$1.html');
    }
    return p.replace(/.*src\/entry\/(.*)\.(js|jsx)$/, 'src/html/$1.html');
  }
});

let entries = entryConfigs.entries;
let templates = entryConfigs.templates;
let entryGroups = entryConfigs.entryGroups;
let entryObj = {};

Object.keys(entries).forEach((key) => {
  let item = entries[key];
  entryObj[item] = isProduction ?
    './' + item :
    hotReloadEntry.concat('./' + item);
});

// commonPlugins
let cssFileRe = /^.*\.(css|sass|scss|less|styl)$/;
let reVendor = /node_modules/;
let reVendorCore = /node_modules\/.*?(vue|vue-router|mint-ui|swiper|jquery|babel-polyfill|rxjs)/;
let commonPlugins = [
  {
    name: 'vendor',
    minChunks: function (module, count) {
      if (!module.resource || cssFileRe.test(module.resource)) {
        return false;
      }

      if (
        reVendor.test(module.resource)
      ) {
        return true;
      }

      return false;
    },
    chunks: entryGroups.main || [],
  },
  {
    name: 'vendor-core',
    minChunks: function (module, count) {
      if (!module.resource || cssFileRe.test(module.resource)) {
        return false;
      }

      if (
        reVendorCore.test(module.resource)
      ) {
        return true;
      }

      return false;
    },
    chunks: ['vendor']
  },
  // manifest
  {
    name: "manifest",
    minChunks: Infinity,
    chunks: ['vendor-core'],
  }
].map(item => {
  return new webpack.optimize.CommonsChunkPlugin(item);
});

let commonChunks = {
  main: ['vendor', 'vendor-core'],
};

// htmlPlugins
let htmlPlugins = [
  new PlaceAssetsPlugin({
    headReplaceExp: /<!-- html-webpack-plugin-css -->/,
    bodyReplaceExp: /<!-- html-webpack-plugin-script -->/,
    tagsJoin: '\n  ',
  })
];

// html files
let groups = Object.keys(entryGroups);
groups.forEach(groupName => {
  entryGroups[groupName].forEach(item => {
    let template = './' + templates[item];
    let filename = template.replace(/.*src\/html\/(.*)\.html$/, '_view/$1.html');

    // h5 pages
    if (template.indexOf('h5/html/') != -1) {
      filename = template.replace(/.*src\/h5\/html\/(.*)\.html$/, 'h5/$1.html');
    }

    let chunks = ['manifest']
      .concat(commonChunks[groupName])
      .concat(item);

    htmlPlugins.push(
      new HtmlWebpackPlugin({
        template: template,
        filename: filename,
        chunks: chunks,
        chunksSortMode: 'dependency', //'dependency',
        inject: false
      })
    );
  });
});

// exports
const configExports = {};

// config exports
configExports.context = contextPath;
configExports.entry = entryObj;
configExports.output = {
  path: publicConf.distPath,
  filename: 'static/js/[name].[hash].js',
  publicPath: publicConf.publicPath,
};

// resolve
configExports.resolve = {
  modules: [
    'node_modules',
    path.resolve(contextPath, '../node_modules')
  ],
  extensions: ['.js', '.jsx', '.vue', '.json', '.less'],
  alias: {
    //
  }
};

// definePlugin not useable in html, 
// so use string replace instead
let stringReplaceOptions = [];
Object.keys(defines).forEach(key => {
  if (key.indexOf('REPLACE_') === 0) {
    stringReplaceOptions.push({
      search: key,
      replace: defines[key],
      flags: 'g'
    });
  }
});

// module
configExports.module = {
  rules: [
    {
      test: /\.html$/,
      use: [
        {
          loader: 'html-loader',
          options: {
            attrs: ['img:src'],
            minimize: true,
            removeComments: false,
            collapseWhitespace: false,
            removeAttributeQuotes: false,
            interpolate: 'require',
          }
        },
        {
          loader: 'string-replace-loader',
          options: {
            multiple: stringReplaceOptions
          }
        }
      ]
    },
    {
      test: /\.vue$/,
      use: 'happypack/loader?id=vue'
    },
    {
      test: /\.less$/,
      use: styleLoaders.happyLoaders.less
    },
    {
      test: /\.css$/,
      use: styleLoaders.happyLoaders.css
    },
    {
      test: /\.scss$/,
      use: styleLoaders.happyLoaders.sass
    },
    {
      test: /\.js$/,
      use: 'happypack/loader?id=babel'
    },
    {
      test: /\.jsx$/,
      use: 'happypack/loader?id=babel'
    },
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'static/imgs/[path][name].[hash].[ext]'
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'static/fonts/[path][name].[hash].[ext]'
      }
    }
  ]
};

// plugins
configExports.plugins = [
  new HappyPack({
    id: 'babel',
    threads: 4,
    loaders: [
      cacheLoaderOptions,
      babelLoaderOptions
    ]
  }),

  new HappyPack({
    id: 'vue',
    threads: 4,
    loaders: [
      cacheLoaderOptions,
      {
        loader: 'vue-loader',
        options: {
          loaders: Object.assign({}, styleLoaders.loaders, {
            js: babelLoaderOptions
          })
        } 
      }
    ]
  }),

  // new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.DefinePlugin(defines),
  extractCss,
  new CopyWebpackPlugin([
    {
      from: path.resolve(contextPath, './root'),
      to: path.resolve(publicConf.distPath),
      ignore: ['.*']
    }
  ])
]
.concat(htmlPlugins)
.concat(commonPlugins)
.concat(styleLoaders.happyPackPlugins);

// production
if (isProduction) {
  configExports.plugins = configExports.plugins.concat([
    new webpack.HashedModuleIdsPlugin({
      hashDigestLength: 4
    })
  ]);
} else {
  configExports.plugins = configExports.plugins.concat([
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]);
}

// compress
if (publicConf.compress) {
  configExports.plugins = configExports.plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: !!publicConf.sourceMap
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    })
  ]);
}

module.exports = configExports;