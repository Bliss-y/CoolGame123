import { Reflex } from '@bhoos/reflex-engine';
import { RoomConfig } from '@bhoos/super-app-interface';
import { StateOf } from '@bhoos/game-kit-engine';

export function computeReflexWinnings(state: StateOf<Reflex>, roomConfig: RoomConfig<Reflex>, playerIdx: number) {
  if (state.winnerIdx === -1) return -roomConfig.boot;
  if (state.winnerIdx === playerIdx) return roomConfig.boot * (state.players.length - 1);
  return -roomConfig.boot;
}
