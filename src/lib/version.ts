import { version } from '../../package.json';

export const PLATFORM_VERSION = version;
export const CHANNEL_TAG = 'alpha';

export const getPlatformVersion = () => `${PLATFORM_VERSION}`;
