const { gitDescribeSync } = require('git-describe')
const { version } = require('../package.json')
const { resolve, relative } = require('path')
const { writeFileSync } = require('fs-extra')
const mkdirp = require('mkdirp')

const getDirName = require('path').dirname

const gitInfo = gitDescribeSync({
  dirtyMark: false,
  dirtySemver: false,
})

gitInfo.version = version

const writeFile = async (path, content) => {
  await mkdirp(getDirName(file))
  writeFileSync(path, content, { encoding: 'utf-8' })
}

const file = resolve(
  __dirname,
  '..',
  'src',
  'environments',
  'environment-generated.ts',
)

writeFile(
  file,
  `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */

/**
 * Git version generated on npm install
 */
export const VERSION = ${JSON.stringify(gitInfo, null, 4)};

/**
 * Google analytics tracking ID from the environment variables
 */
export const GOOGLE_ANALYTICS_TRACKING_ID = ${
    process.env.GOOGLE_ANALYTICS_TRACKING_ID
  }

/* tslint:enable */
`,
)

console.log(
  `Wrote version info ${gitInfo.raw} to ${relative(
    resolve(__dirname, '..'),
    file,
  )}`,
)
