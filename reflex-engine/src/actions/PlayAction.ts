import { Action, Client, Match } from '@bhoos/game-kit-engine';
import { Serializer } from '@bhoos/serialization';
import { Reflex, ReflexActionConsumer } from '../Reflex.js';

export class PlayAction extends Action<Reflex> {
  playerIdx!: number;

  forwardTo<R>(consumer: ReflexActionConsumer<R>): R {
    return consumer.onPlay(this);
  }

  serialize(serializer: Serializer) {
    this.playerIdx = serializer.uint8(this.playerIdx);
  }

  personalize(_client: Client<Reflex>, _match: Match<Reflex>) {
    return this;
  }

  static create(playerIdx: number) {
    const instance = new PlayAction();
    instance.playerIdx = playerIdx;

    return instance;
  }
}
