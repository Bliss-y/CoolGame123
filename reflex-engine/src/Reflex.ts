import { EventConsumer, Game, Timer } from '@bhoos/game-kit-engine';
import { ReflexState } from './ReflexState.js';
import { FinishGameAction, StartGameAction, PlayAction } from './actions';
import { Oracle } from '@bhoos/serialization';
import { PlayApi } from './apis';
import { ReflexConfig } from './ReflexConfig.js';

export interface ReflexActionConsumer<Return> {
  onStartGame(action: StartGameAction): Return;
  onPlay(action: PlayAction): Return;
  onFinishGame(action: FinishGameAction): Return;
}

export interface ReflexEventConsumer extends EventConsumer {}

export type ReflexPlayer = {
  id: string;
  name: string;
  picture: string;
};

export type Reflex = Game<ReflexActionConsumer<never>, ReflexState, ReflexEventConsumer, ReflexPlayer, ReflexConfig>;

export function registerToOracle(oracle: Oracle): Oracle {
  const actions = [StartGameAction];

  const apis = [PlayApi];
  const timers = [Timer];

  timers.forEach((timer, idx) => oracle.register(0x1000 + idx, timer, () => new timer()));
  apis.forEach((api, idx) => oracle.register(0x2000 + idx, api, () => new api()));
  actions.forEach((action, idx) => oracle.register(0x4000 + idx, action, () => new action()));

  return oracle;
}
