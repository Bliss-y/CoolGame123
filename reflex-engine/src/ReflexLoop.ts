import { Match, Timer } from '@bhoos/game-kit-engine';
import { Reflex } from './Reflex.js';
import { ReflexConfig } from './ReflexConfig.js';
import { validateConfig } from './utils/validateConfig.js';
import { PlayAction } from './actions/PlayAction.js';
import { PlayApi } from './apis/PlayApi.js';
import { StartGameAction } from './actions/StartGameAction.js';

export const PLAY_TIMER = 3000;
type TimerArgs = {
  id: number;
  type: number;
  target: number;
  interval: number;
};

function createTimer({ id, type, target, interval }: TimerArgs) {
  return Timer.create(id, type, target, interval);
}

export async function ReflexLoop(match: Match<Reflex>, config: ReflexConfig) {
  // Initialization
  if (match.getEndingCode() !== null) return match;
  if (!validateConfig(match.getPlayers().length, config)) {
    console.error(`Invalid config`);
    return match.end(1);
  }
  const playTimer = match.createPersistentEvent(() => {
    return createTimer({
      id: 1,
      type: 1,
      target: 1,
      interval: -1,
    });
  });

  const state = match.getState();
  console.log(match.getPlayers());
  let running = true;
  match.dispatch(StartGameAction.create(match.getPlayers()))
  for (const player of match.getState().players) {
    match.wait(playTimer, (ctx) => {
      ctx.on(PlayApi, (api) => {
        return true;
      }, (api) => {
        for (const controlled of match.getState().players[api.playerIdx].controller.controlled) {
          controlled.input = api.position;
        }
      });
    });
  }
  let tick = 0;
  while (running) {
    //TODO:  make this a ticker
    await sleep(1000 / 20);
    match.getState().edibleComponent.update(tick);
    for (const obj of match.getState().objects) {
      obj.update(tick);
    }
    match.dispatch(PlayAction.create(match.getState()));
  }
  match.end(0);
}

export async function sleep(n: number) {
  return new Promise(r => setTimeout(r, n));
}

