const { override, fixBabelImports, addLessLoader, addBabelPlugins } = require('customize-cra');

module.exports = override(
  ...addBabelPlugins(
    [
      'babel-plugin-root-import',
      {
        "paths": [
          {
            "rootPathSuffix": "./src/App",
            "rootPathPrefix": "App/"
          },
          {
            "rootPathSuffix": "./src/utils",
            "rootPathPrefix": "utils/"
          },
          {
            "rootPathSuffix": "./src/assets",
            "rootPathPrefix": "assets/"
          },
        ]
      },
    ]
  ),
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#68eae1',
      '@success-color': '#47fcc4',
      '@warning-color': '#ffee6a',
      '@error-color': '#f45b69',
      '@component-background': 'fade(#1e1e24, 100%)',
      '@body-background': 'fade(#1e1e24, 100%)',
      '@table-selected-row-bg': 'fade(#1e1e24, 100%)',
      '@text-color': '#f1fffa',
      '@text-color-secondary': '#68eae1',
      '@highlight-color': '#68eae1',
      '@disabled-color': 'fade(#f1fffa, 30%)',
      '@heading-color': '#f1fffa',
      '@font-family': 'Poppins',
    },
  }),
);
