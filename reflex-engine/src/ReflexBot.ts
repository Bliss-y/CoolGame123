import { Action, Client, Event, Match, Timer } from '@bhoos/game-kit-engine';
import { Reflex } from './Reflex.js';
import { ReflexState } from './ReflexState.js';
import { PLAY_TIMER } from './ReflexLoop.js';
import { PlayApi } from './apis/PlayApi.js';

export class ReflexBot implements Client<Reflex> {
  playerId: string;
  playerIdx: number;
  state: ReflexState;
  match: Match<Reflex>;

  constructor(playerId: string, match: Match<Reflex>) {
    this.playerId = playerId;
    this.state = match.getState();
    this.playerIdx = match.getPlayers().findIndex(p => p.id === playerId);
    this.match = match;
  }

  end(_code: number): void { }

  dispatch(_action: Action<Reflex>): void { }

  emit(event: Event<Reflex>): void {
    if (event instanceof Timer) {
      if (event.target != this.playerIdx) return;
      if (event.type === PLAY_TIMER) {
        const randompos = Math.random();
        this.match.execute(PlayApi.create(this.playerIdx, { x: randompos, y: 1 - randompos }), this).catch(console.error);
      }
    }
  }
}
