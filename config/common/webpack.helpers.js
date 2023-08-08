const path = require('path');
const cwd = process.cwd();

/**
 * Are we in development mode?
 */
function isDev () {
  return process.env.NODE_ENV === 'development';
}

function isMfe () {
  return process.env.IS_MFE === 'true';
}

/**
 * Create webpack aliases
 */
function createWebpackAliases (aliases) {
  const result = {};
  aliases = { ...aliases, ...getTsConfigPaths() };
  for (const name in aliases) {
    const key = name.replace('/*', '');
    const value = Array.isArray(aliases[name]) ? aliases[name][0] : aliases[name];
    result[key] = path.resolve(cwd, value.replace('/*', '').replace('*', ''));
  }
  return result;
}

function getTsConfigPaths () {
  let paths = {};
  const tsConfigDefault = { compilerOptions: { paths: {} } };
  let tsConfig = {};
  let tsConfigBase = {};
  try {
    tsConfig = require(path.resolve('./tsconfig.json'));
    paths = { ...tsConfigDefault, ...tsConfig }.compilerOptions.paths;
  } catch (error) {
    return paths;
  }
  try {
    tsConfigBase = require(path.resolve(tsConfig.extends));
    return { ...paths, ...{ ...tsConfigDefault, ...tsConfigBase }.compilerOptions.paths };
  } catch (error) {
    return paths;
  }
}

// Export helpers
module.exports = {
  isDev,
  isMfe,
  createWebpackAliases,
};
