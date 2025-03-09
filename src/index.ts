import { lazyBuild, buildAdapter } from 'zesti/adapter/cloudflare';
import build from 'zesti/build/fast';

import routes from './routes';

import { changeAdminSecret } from './utils/admin';
import { loadEnv } from './utils/cf/env';

export default lazyBuild(
	(env) => {
		// Initialization code
		loadEnv(env);
		changeAdminSecret();

		return build(routes, buildAdapter);
	},
	{
		scheduled: (controller) => {
			switch (controller.cron) {
				// Every midnight
				case '0 0 * * *': {
					changeAdminSecret();
					break;
				}
			}
		}
	}
);
