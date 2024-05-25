import { Match, Timer } from '@bhoos/game-kit-engine';
import { Reflex } from './Reflex.js';
import { ReflexConfig } from './ReflexConfig.js';
import { PlayEvent } from './actions/PlayAction.js';
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
  if (match.getEndingCode() !== null) return;
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
  await sleep(5000);
  match.dispatch(StartGameAction.create(match.getPlayers()))
  match.wait(playTimer, (ctx) => {
    ctx.on(PlayApi, (api) => {
      return true;
    }, async (api) => {
      for (const controlled of match.getState().players[api.playerIdx].controller.controlled) {
        console.log("api recieved", api.playerIdx);
        controlled.input = api.position;
      }
    });
  });
  let tick = 0;
  while (running) {
    //TODO:  make this a ticker
    state.turn++;
    await sleep(1000 / 50);
    if (match.getEndingCode() != null) {
      console.log("Ending code hit");
      running = false;
    }
    state.colliderComponent.update();
    match.getState().edibleComponent.update(tick);
    for (const obj of match.getState().objects) {
      obj.update(tick);
    }
    match.emit(PlayEvent.create(match.getState()));
    tick++;
    if (tick > 50 * 10) {
      running = false;
    }
  }
  match.end(0);
}

export async function sleep(n: number) {
  return new Promise(r => setTimeout(r, n));
}

