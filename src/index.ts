import router, { lazyBuild, buildAdapter } from 'zesti/adapter/cloudflare';
import build from 'zesti/build/fast';
import cors from 'zesti/utils/cors';

import { changeAdminSecret } from './utils/admin';

const app = router()
	.use(
		cors('https://clubadapt.pages.dev', {
			allowCredentials: true
		})
	);

export default lazyBuild(() => build(app, buildAdapter), {
	scheduled: (controller) => {
		switch (controller.cron) {
			// Every midnight
			case '0 0 * * *': {
				changeAdminSecret();
				break;
			}
		}
	}
});
