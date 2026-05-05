import { createRequire } from 'module';
global.require = () => 'mocked-image-path';

console.log("Starting Simulation Scripts...");

await import('./run-simulations.mjs');
await import('./run-adaptation.mjs');
