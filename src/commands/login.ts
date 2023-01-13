import { TCommandArgs } from '.';
import open from 'open';
import express from 'express';
import axios from 'axios';
import logger from '../utils/logger';
import { saveToken } from '../utils/saveToken';

const redirect = encodeURIComponent('http://localhost:3001/oauth');

export const loginCommand: TCommandArgs = [
  'auth login',
  'Login to CLI for contribution',
  () => {
    //
  },
  async () => {
    const app = express();

    let resolve;
    const p = new Promise((_resolve) => {
      resolve = _resolve;
    });
    app.get('/oauth', function (req, res) {
      resolve(req.query.authorizeToken);
      res.send('<h1>Success! You may close this window now.</h1>');
      res.end();
    });
    const server = await app.listen(3001);

    open(`http://localhost:3000/login?redirectUrl=${redirect}`);

    // Wait for the first auth code
    const authorizeToken = await p;

    await server.close();

    axios
      .get('http://localhost:3000/auth/me', {
        headers: {
          Authorization: `Bearer ${authorizeToken}`,
        },
      })
      .then(async () => {
        logger.success(`Logged in successfully! -> ${authorizeToken}`);
        await saveToken(authorizeToken as string);
      })
      .catch((err: Error) => {
        logger.error(`Login unsuccessful! ${err?.message}`);
      })
      .finally(() => {
        process.exit(0);
      });
  },
];
