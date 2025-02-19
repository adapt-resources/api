import { lazyBuild, buildAdapter } from 'zesti/adapter/cloudflare';
import build from 'zesti/build/fast';

import routes from './routes';
import { changeAdminSecret } from './utils/admin';
import { initPassHasher } from './utils/pwd';

export default lazyBuild(
	() => {
		// Initialization code
		changeAdminSecret();
		initPassHasher();

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
