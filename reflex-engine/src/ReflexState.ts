import { ReflexActionConsumer } from './Reflex.js';
import { StartGameAction } from './actions/StartGameAction.js';
import { PlayEvent } from './actions/PlayAction.js';
import { FinishGameAction } from './actions/FinishGameAction.js';
import { Circles, Collision, Controller, EdibleComponent, Food, GameObject } from './ecs/Object.js';
import { GameComponent } from './ecs/Component.js';

export interface ReflexStatePlayer {
  id: string;
  name: string;
  picture: string;
  clickCount: number;
  controller: Controller;
}

export const REFLEX_STAGE_START = 1;
export const REFLEX_STAGE_PLAY = 2;
export const REFLEX_STAGE_END = 3;

export type REFLEX_STAGE = typeof REFLEX_STAGE_START | typeof REFLEX_STAGE_PLAY | typeof REFLEX_STAGE_END;

export class ReflexState implements ReflexActionConsumer<void> {
  static states: ReflexState[] = []
  stage: REFLEX_STAGE = REFLEX_STAGE_START;
  players: ReflexStatePlayer[] = [];
  userIdx: number = -1;

  turn: number = -1;
  winnerIdx: number = -1;
  objects: GameObject[] = [];
  components: GameComponent[] = [];
  edibleComponent: EdibleComponent = new EdibleComponent();
  colliderComponent: Collision = new Collision();

  constructor() {
    for (let i = 0; i < 10; i++) {
      const food = new Food({ x: Math.random() * 950, y: Math.random() * 950 }, 10);
      this.edibleComponent.edibles.push(food);
      this.objects.push(food)
    }
    ReflexState.states.push(this);
    console.log("STATE CREATED", ReflexState.states.length);
  }

  onStartGame(action: StartGameAction): void {
    console.log("start game aciton ", action);
    this.players = action.players.map(player => ({
      id: player.id,
      name: player.name,
      picture: player.picture,
      clickCount: 0,
      controller: new Controller(),
    }));
    let i = 0;
    for (const player of this.players) {
      const food = new Circles({ x: Math.random() * 950, y: Math.random() * 950 }, 50);
      this.edibleComponent.eaters.push(food);
      this.objects.push(food)
      this.colliderComponent.colliders.push(food);
      player.controller.controlled.push(food);
      i++;
    }
    this.userIdx = action.userIdx;
  }

  onPlayEvent(action: PlayEvent): void {
    for (const obj in this.objects) {
      this.objects[obj].position = action.objects[obj].position;
      this.objects[obj].radius = action.objects[obj].radius;
      this.objects[obj].id = action.objects[obj].id;
      this.objects[obj].destroyed = action.objects[obj].destroyed;
      this.objects[obj].color = action.objects[obj].color;
    }
    return;
  }

  onFinishGame(action: FinishGameAction): void {
    this.stage = REFLEX_STAGE_END;
    this.winnerIdx = action.winnerIdx;
  }
}
