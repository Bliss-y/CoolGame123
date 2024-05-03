import { ReflexActionConsumer } from './Reflex.js';
import { StartGameAction } from './actions/StartGameAction.js';
import { PlayAction } from './actions/PlayAction.js';
import { FinishGameAction } from './actions/FinishGameAction.js';

export interface ReflexStatePlayer {
  id: string;
  name: string;
  picture: string;

  clickCount: number;
}

export const REFLEX_STAGE_START = 1;
export const REFLEX_STAGE_PLAY = 2;
export const REFLEX_STAGE_END = 3;


export type REFLEX_STAGE = typeof REFLEX_STAGE_START | typeof REFLEX_STAGE_PLAY | typeof REFLEX_STAGE_END;

export class ReflexState implements ReflexActionConsumer<void> {
  stage: REFLEX_STAGE = REFLEX_STAGE_START;
  players: ReflexStatePlayer[] = [];
  userIdx: number = -1;

  turn: number = -1;
  winnerIdx: number = -1;

  onStartGame(action: StartGameAction): void {
    this.stage = REFLEX_STAGE_PLAY;
    this.players = action.players.map(player => ({
      id: player.id,
      name: player.name,
      picture: player.picture,

      clickCount: 0,
    }));

    this.userIdx = action.userIdx;
    this.turn = 0;
  }

  onPlay(action: PlayAction): void {
    this.players[action.playerIdx].clickCount++;
  }

  onFinishGame(action: FinishGameAction): void {
    this.stage = REFLEX_STAGE_END;
    this.winnerIdx = action.winnerIdx;
  }
}
