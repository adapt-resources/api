import { lazyBuild, buildAdapter } from 'zesti/adapter/cloudflare';
import build from 'zesti/build/fast';

import routes from './routes';

import { changeAdminSecret } from './utils/admin';
import { createUTApi } from './utils/ut';
import { loadQueries } from './utils/query';

export default lazyBuild(
	(env) => {
		// Initialization code
		changeAdminSecret();
		createUTApi(env);
		loadQueries(env);

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
