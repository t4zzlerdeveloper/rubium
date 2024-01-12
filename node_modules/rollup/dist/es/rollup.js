/*
  @license
	Rollup.js v4.9.2
	Sat, 30 Dec 2023 06:23:00 GMT - commit 347a34745b2679c1192535db3c0f60889861d3ad

	https://github.com/rollup/rollup

	Released under the MIT License.
*/
export { version as VERSION, defineConfig, rollup, watch } from './shared/node-entry.js';
import './shared/parseAst.js';
import '../native.js';
import 'node:path';
import 'path';
import 'node:process';
import 'node:perf_hooks';
import 'node:fs/promises';
import 'tty';
