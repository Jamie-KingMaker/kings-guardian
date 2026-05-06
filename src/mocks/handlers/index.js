// src/mocks/handlers/index.js
// AI handlers are intentionally excluded — /api/v1/ai/* requests bypass MSW
// and flow through the BFF dev-server to the real Claude API.
// MSW uses onUnhandledRequest:'bypass' so unregistered routes hit the network.
export { dashboardHandlers }   from './dashboard.js';
export { playerHandlers }      from './players.js';
export { interactionHandlers } from './interactions.js';

import { dashboardHandlers }   from './dashboard.js';
import { playerHandlers }      from './players.js';
import { interactionHandlers } from './interactions.js';

export const handlers = [
  ...dashboardHandlers,
  ...playerHandlers,
  ...interactionHandlers,
  // aiHandlers intentionally omitted — real Claude API handles these
];

