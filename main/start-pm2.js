const pm2 = require('pm2');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const ENV = process.env.SERVER_NODE_ENV;
const baseConfig = getEnv('base.env');
const envConfig = getEnv(`${ENV}.env`);
const senvConfig = Object.assign(baseConfig, envConfig);
function getEnv(filePath) {
  return dotenv.parse(fs.readFileSync(path.resolve('./.env/', filePath))) || {};
}

pm2.connect(function(err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }
  pm2.start(
    {
      script: './dist/main.js',
      name: `${senvConfig['SCUM_NO']}`,
      exec_mode: 'cluster',
      instances: '1',
      env: {
        SERVER_NODE_ENV: process.env.SERVER_NODE_ENV || 'production',
      },
      max_memory_restart: '700M',
      cron_restart: '0 7 * * *'
    },
    (err, apps) => {
      pm2.disconnect();
      if (err) {
        throw err;
      }
    },
  );
});
