import { Action, Event, Client, Match } from '@bhoos/game-kit-engine';
import { Serializer } from '@bhoos/serialization';
import { Reflex, ReflexActionConsumer, ReflexEventConsumer } from '../Reflex.js';
import { ReflexState } from '../ReflexState.js';

export type SimplifiedGameObject = {
  position: { x: number, y: number };
  id: number,
  radius: number
  destroyed: boolean;
  color: number;
}

export class PlayEvent extends Event<Reflex> {
  objects!: SimplifiedGameObject[];

  forwardTo<R>(consumer: ReflexEventConsumer) {
    return consumer.onPlayEvent(this);
  }

  serialize(serializer: Serializer) {
    this.objects = serializer.array(this.objects, (el) => {
      return serializer.obj(el, (obj, sr) => {
        obj.id = sr.uint32(obj.id);
        obj.radius = sr.uint32(obj.radius);
        obj.color = sr.uint32(obj.color);
        const x = sr.uint32(obj.position.x);
        const y = sr.uint32(obj.position.y);
        obj.position.x = x;
        obj.position.y = y;
        obj.destroyed = sr.bool(obj.destroyed);
      });
    })
  }

  personalize(_client: Client<Reflex>, _match: Match<Reflex>) {
    return this;
  }

  static create(state: ReflexState) {
    const instance = new PlayEvent();
    instance.objects = state.objects;
    return instance;
  }
}
