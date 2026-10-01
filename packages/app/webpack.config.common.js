require('./webpack.monkeypatch-crypto');
const path = require('path');
const webpack = require('webpack');

// Build-time secrets (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) from the untracked
// `.env` at the repo root, see `.env.example`. Variables already set in the
// environment, as on CI, take precedence. A git worktree (e.g. .claude/worktrees/*)
// has no copy of the untracked file, so fall back to the main checkout's.
const loadDotenv = () => {
  const fs = require('fs');
  const candidates = [path.resolve(__dirname, '../../.env')];
  try {
    const commonDir = require('child_process')
      .execSync('git rev-parse --path-format=absolute --git-common-dir', { cwd: __dirname, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim();
    candidates.push(path.resolve(commonDir, '..', '.env'));
  } catch (e) {
    // not a git checkout
  }
  const envFile = candidates.find(file => fs.existsSync(file));
  if (envFile) require('dotenv').config({ path: envFile });
};
loadDotenv();

/* eslint-disable no-param-reassign */

/**
 * Disable verbose logs
 * @param config {webpack.Configuration}
 */
const mutateStats = config => {
  config.stats = 'errors-only';
};

/**
 * set ts-loader as transpileOnly for now. Also excludes node_modules from compilation
 * @param config {webpack.Configuration}
 */
const mutateFixTsLoader = config => {
  const tsLoader = config.module.rules.find(
    r => r && r.use && r.use[0] && r.use[0].loader === 'ts-loader'
  );

  if (tsLoader) {
    tsLoader.use[0].options.transpileOnly = true;
    tsLoader.exclude = /node_modules/;
  }
};

/**
 * minimizer should keep classnames and fnames
 * @param config {webpack.Configuration}
 */
const mutateFixTerser = config => {
  if (config.mode === 'production') {
    Object.assign(config.optimization.minimizer[0].options.terserOptions, {
      keep_classnames: true,
      keep_fnames: true
    });
  }
};

/**
 * add sources to sourcemap
 * @param config {webpack.Configuration}
 */
const mutateDevtool = config => {
  if (config.mode === 'production') {
    config.devtool = process.env.WEBPACK_DEVTOOL;
  }
};

/**
 * loader for graphql schema and .env.* files
 * @param config {webpack.Configuration}
 */
const mutateAddRules = config => {
  config.module.rules.push({
    test: /\.graphql$/,
    exclude: /node_modules/,
    loader: 'graphql-import-loader'
  });
};

/**
 * minimizer should keep classnames and fnames
 * @param config {webpack.Configuration}
 */
const mutateAddExternals = config => {
  // Used by window-open overload
  config.externals.push('react-addons-perf');
};

/**
 * alias some missing imports
 * @param config {webpack.Configuration}
 */
const mutateAlias = config => {
  // Electron does not bundle `ipcRendererInternal` anymore since 7.x
  config.resolve.alias[
    '@electron/internal/renderer/ipc-renderer-internal'
  ] = path.resolve(__dirname, 'app/lib/ipc-renderer-internal.ts');
};

/**
 * @param config {webpack.Configuration}
 */
const mutateWebpackConfig = config => {
  mutateStats(config);
  mutateFixTsLoader(config);
  mutateFixTerser(config);
  mutateAddRules(config);
  mutateAddExternals(config);
  mutateDevtool(config);
  mutateAlias(config);

  if (config.mode === 'production') {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.warn('\n⚠️  GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not set: "Sign in with Google" will not work in this build. See .env.example.\n');
    }
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.GOOGLE_CLIENT_ID': JSON.stringify(
          process.env.GOOGLE_CLIENT_ID
        ),
        'process.env.GOOGLE_CLIENT_SECRET': JSON.stringify(
          process.env.GOOGLE_CLIENT_SECRET
        )
      })
    );
  }
};

module.exports = {
  mutateWebpackConfig
};
