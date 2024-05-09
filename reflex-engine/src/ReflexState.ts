import { ReflexActionConsumer } from './Reflex.js';
import { StartGameAction } from './actions/StartGameAction.js';
import { PlayAction } from './actions/PlayAction.js';
import { FinishGameAction } from './actions/FinishGameAction.js';
import { Circles, Controller, EdibleComponent, Food, GameObject } from './ecs/Object.js';
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
  stage: REFLEX_STAGE = REFLEX_STAGE_START;
  players: ReflexStatePlayer[] = [];
  userIdx: number = -1;

  turn: number = -1;
  winnerIdx: number = -1;
  objects: GameObject[] = [];
  components: GameComponent[] = [];
  edibleComponent: EdibleComponent = new EdibleComponent();

  constructor() {
    console.log("Calling Reflex state");
    for (let i = 0; i < 4; i++) {
      const food = new Circles({ x: 200, y: 200 }, 50);
      this.edibleComponent.eaters.push(food);
      this.objects.push(food)
    }
    for (let i = 0; i < 10; i++) {
      const food = new Food({ x: 50, y: 30 }, 10);
      this.edibleComponent.edibles.push(food);
      this.objects.push(food)
    }
  }

  onStartGame(action: StartGameAction): void {
    this.players = action.players.map(player => ({
      id: player.id,
      name: player.name,
      picture: player.picture,
      clickCount: 0,
      controller: new Controller(),
    }));
    let i = 0;
    for (const player of this.players) {
      //@ts-ignore
      player.controller.controlled.push(this.edibleComponent.eaters[i]);
      i++;
    }
    this.userIdx = action.userIdx;
    this.turn = 0;
  }

  onPlay(action: PlayAction): void {
    for (const obj of this.objects) {
      obj.update(1);
    }
  }

  onFinishGame(action: FinishGameAction): void {
    this.stage = REFLEX_STAGE_END;
    this.winnerIdx = action.winnerIdx;
  }
}
