// src/mocks/handlers/index.js
export { dashboardHandlers }   from './dashboard.js';
export { playerHandlers }      from './players.js';
export { interactionHandlers } from './interactions.js';
export { aiHandlers }          from './ai.js';

import { dashboardHandlers }   from './dashboard.js';
import { playerHandlers }      from './players.js';
import { interactionHandlers } from './interactions.js';
import { aiHandlers }          from './ai.js';

export const handlers = [
  ...dashboardHandlers,
  ...playerHandlers,
  ...interactionHandlers,
  ...aiHandlers,
];

