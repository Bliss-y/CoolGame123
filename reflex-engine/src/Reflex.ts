import { EventConsumer, Game, Timer } from '@bhoos/game-kit-engine';
import { ReflexState } from './ReflexState.js';
import { FinishGameAction, StartGameAction } from './actions';
import { Oracle } from '@bhoos/serialization';
import { PlayApi } from './apis';
import { ReflexConfig } from './ReflexConfig.js';
import { PlayEvent } from './actions/PlayAction.js';

export interface ReflexActionConsumer<Return> {
  onStartGame(action: StartGameAction): Return;
  onFinishGame(action: FinishGameAction): Return;
}

export interface ReflexEventConsumer extends EventConsumer {
  onPlayEvent(event: PlayEvent): void;
}

export type ReflexPlayer = {
  id: string;
  name: string;
  picture: string;
};

export type Reflex = Game<ReflexActionConsumer<never>, ReflexState, ReflexEventConsumer, ReflexPlayer, ReflexConfig>;

export function registerToOracle(oracle: Oracle): Oracle {
  const actions = [StartGameAction];

  const apis = [PlayApi];
  const timers = [Timer, PlayEvent];

  timers.forEach((timer, idx) => oracle.register(0x1000 + idx, timer, () => new timer()));
  apis.forEach((api, idx) => oracle.register(0x2000 + idx, api, () => new api()));
  actions.forEach((action, idx) => oracle.register(0x4000 + idx, action, () => new action()));

  return oracle;
}
