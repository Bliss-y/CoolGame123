import { Action, Client, Match } from '@bhoos/game-kit-engine';
import { Serializer } from '@bhoos/serialization';
import { Reflex, ReflexActionConsumer } from '../Reflex.js';

export class FinishGameAction extends Action<Reflex> {
  winnerIdx!: number;

  forwardTo<R>(consumer: ReflexActionConsumer<R>): R {
    return consumer.onFinishGame(this);
  }

  serialize(serializer: Serializer) {
    this.winnerIdx = serializer.uint8(this.winnerIdx);
  }

  personalize(_client: Client<Reflex>, _match: Match<Reflex>) {
    return this;
  }

  static create(winnerIdx: number) {
    const instance = new FinishGameAction();
    instance.winnerIdx = winnerIdx;

    return instance;
  }
}
