import { Api } from '@bhoos/game-kit-engine';
import { Serializer } from '@bhoos/serialization';
import { Reflex } from '../Reflex.js';
import { REFLEX_STAGE_PLAY, ReflexState } from '../ReflexState.js';
import { assert } from '../utils/utils.js';

export class PlayApi extends Api<Reflex> {
  playerIdx!: number;

  serialize(serializer: Serializer): void {
    this.playerIdx = serializer.uint8(this.playerIdx);
  }

  static validate(api: PlayApi, state: ReflexState, playerIdx: number) {
    assert(state.stage === REFLEX_STAGE_PLAY, "Current stage is not PLAY");
    assert(playerIdx === api.playerIdx, "playerIdx for Client and API payload don't match");
  }

  static create(playerIdx: number) {
    const instance = new PlayApi();

    instance.playerIdx = playerIdx;
    return instance;
  }
}
