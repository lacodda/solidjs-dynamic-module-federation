#! /usr/bin/env node

// index.mjs

import { $, chalk, cd, argv, spinner, fs } from 'zx';
import path from 'path';
import * as dotenv from 'dotenv';

const APPS_DIR = path.resolve('apps');
const DIST_DIR = path.resolve('dist');
const CONFIG_DEV = path.resolve('config', 'webpack.config.dev.js');
const CONFIG_PROD = path.resolve('config', 'webpack.config.prod.js');
const colors = ['#009dd6', '#ec33ec', '#d6f028', '#1034a6', '#edb3eb', '#00cc99', '#fdf35e', '#E74C3C', '#27AE60', '#C70039'];
$.env.DIST_DIR = DIST_DIR;
$.env.IS_MFE = await fs.pathExists(APPS_DIR);
$.verbose = false;

function exitWithError (errorMessage) {
  // eslint-disable-next-line no-console
  console.error(chalk.red(errorMessage));
  process.exit(1);
}

async function getDirectories (source) {
  if (!await fs.pathExists(source)) {
    return [['app', path.resolve().replaceAll(path.sep, '/')]];
  }
  return (await fs.readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => [dirent.name, path.resolve(source, dirent.name).replaceAll(path.sep, '/')]);
}

async function getPorts () {
  const ports = {};
  if (argv.mode !== 'serve') {
    return ports;
  }
  const apps = await getDirectories(APPS_DIR);
  apps.forEach(async ([_dir, appPath]) => {
    const envPath = path.resolve(appPath, '.env.production');
    dotenv.config({ path: envPath, override: true });
    ports[process.env.APP_NAME] = process.env.APP_PORT;
  });
  return ports;
}

async function run (apps) {
  try {
    const ports = await getPorts();
    await Promise.all(apps.map(async ([dir, appPath]) => {
      cd(appPath);
      switch (argv.mode) {
        case 'development':
          return await webpackServe();
        case 'production':
          return await webpackBuild();
        case 'serve':
          return await serve(dir, ports[dir]);
        default:
          return true;
      }
    }));
  } catch (error) {
    exitWithError(`Error: ${error.message}`);
  }
}

async function webpackServe () {
  try {
    const stream = $`npx webpack serve --config ${CONFIG_DEV.replaceAll(path.sep, '/')}`;
    for await (const chunk of stream.stdout) {
      if (chunk.includes('APP_LISTENING')) {
        const [, appName, host, port] = chunk.toString().split('|');
        const random = Math.floor(Math.random() * colors.length);
        // eslint-disable-next-line no-console
        console.log(chalk.bgGreen.white(' SUCCESS '), 'App', chalk.white.bgHex(colors[random]).bold(` ${appName} `), `starting on ${host}:${port}`);
      }
    }
  } catch (error) {
    exitWithError(`Error: ${error.message}`);
  }
}

async function webpackBuild () {
  try {
    const stream = $`npx webpack --config ${CONFIG_PROD.replaceAll(path.sep, '/')}`;
    for await (const chunk of stream.stdout) {
      if (chunk.includes('APP_BUILT')) {
        const [, appName] = chunk.toString().split('|');
        const random = Math.floor(Math.random() * colors.length);
        // eslint-disable-next-line no-console
        console.log(chalk.bgGreen.white(' SUCCESS '), 'App', chalk.white.bgHex(colors[random]).bold(` ${appName} `), 'built');
      }
    }
  } catch (error) {
    exitWithError(`Error: ${error.message}`);
  }
}

async function serve (dir, port) {
  try {
    const stream = $`npx serve -p ${port}`;
    const msg = 'INFO  Accepting connections at ';
    for await (const chunk of stream.stdout) {
      if (chunk.includes(msg)) {
        const [, host] = chunk.toString().split(msg);
        const random = Math.floor(Math.random() * colors.length);
        // eslint-disable-next-line no-console
        console.log(chalk.bgGreen.white(' SUCCESS '), 'App', chalk.white.bgHex(colors[random]).bold(` ${dir} `), `serving on ${host}`);
      }
    }
  } catch (error) {
    exitWithError(`Error: ${error.message}`);
  }
}

if (!argv.mode) {
  process.exit(1);
}

if (argv.mode === 'production') {
  await $`rm -rf ${DIST_DIR.replaceAll(path.sep, '/')}`;
}

const apps = await getDirectories(argv.mode === 'serve' ? DIST_DIR : APPS_DIR);
await spinner('working...', () => run(apps));
