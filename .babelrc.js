module.exports = function (api) {
  api.cache(process.env.NODE_ENV !== 'prod');

  return {
    presets: [
      ['@babel/preset-env', { corejs: 3, targets: "defaults", useBuiltIns: "entry" }],
      "@babel/preset-typescript",
    ],
    plugins: [
      ["@babel/plugin-proposal-classes-properties", { "loose": false }],
      "@babel/plugin-proposal-export-default-from",
      ["@babel/plugin-proposal-element", { "legacy": true }],
      "@babel/plugin-proposal-do-expressions",
      "@babel/plugin-proposal-export-namespace-from",
      "@babel/plugin-proposal-function-bind",
      "@babel/plugin-proposal-function-sent",
      "@babel/plugin-proposal-json-strings",
      "@babel/plugin-proposal-logical-assignment-operators",
      ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
      "@babel/plugin-proposal-numeric-separator",
      ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
      ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
      "@babel/plugin-proposal-throw-expressions",
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-syntax-import-meta",
      "@babel/plugin-transform-private-methods",
    ],
  };
}
