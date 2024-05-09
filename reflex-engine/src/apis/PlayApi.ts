import { Api } from '@bhoos/game-kit-engine';
import { Serializer } from '@bhoos/serialization';
import { Position } from '../ecs/Object.js';
import { Reflex } from '../Reflex.js';
import { ReflexState } from '../ReflexState.js';

export class PlayApi extends Api<Reflex> {
  playerIdx!: number;
  position!: Position;

  serialize(serializer: Serializer): void {
    this.playerIdx = serializer.uint8(this.playerIdx);
    const p_ = { x: 0, y: 0 };
    p_.x = serializer.int32(this.position.x);
    p_.y = serializer.int32(this.position.y);
    this.position = p_;
  }

  static validate(api: PlayApi, state: ReflexState, playerIdx: number) {
  }

  static create(playerIdx: number, position: Position) {
    const instance = new PlayApi();
    instance.playerIdx = playerIdx;
    instance.position = position;
    return instance;
  }
}

