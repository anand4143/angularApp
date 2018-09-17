// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  //basePath: 'http://localhost:9000',
  basePath: 'https://restapi.concreet.com',
  recaptchaKey: '6Lf6FRQUAAAAAOV_3w-jsmf7SEvysu_Z90EwYdoL',
  access_token: 'RGLCbWwqf1enteReir3lCkxhVQbIgAla',
  numOfRecords: 10,
  s3bucket: 'https://s3-us-west-2.amazonaws.com/development.fs.concreet.com/',
  helloSign_clientID: '39b6578fda03de1d2969f479eb900d22'
};
