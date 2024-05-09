import { SpriteManager, Widget, setLayout, Sprite } from "@bhoos/game-kit-ui";
import { ReflexState } from "@bhoos/reflex-engine";
import { Dimensions } from "react-native";
import { CircleSprite, interpolateCoordinates, ScreenSprite } from "../sprites/Screen";

type Layout = {
  x: number,
  y: number,
  zIndex: number
};

type State = {
  active: boolean
}


export class ScreenWidget extends Widget<Layout, State, SpriteManager> {
  sprites: Map<number, Sprite> = new Map();

  constructor(
    sm: SpriteManager,
    initialState: ReflexState,
    computeLayout: () => Layout,
    computeState: () => State,
  ) {
    super(sm, computeLayout, computeState);
    for (let i = 0; i < 14; i++) {
      const spr = new CircleSprite(i < 4 ? 50 : 10, { x: 0, y: 0 }, Math.floor(Math.random() * 3) + 1, i);
      this.sprites.set(i, spr);
      this.sm.registerSprite(spr);
    }
  }

  onGameUpdate(state: ReflexState) {
    for (const obj of state.objects) {
      if (this.sprites.has(obj.id)) {
        //@ts-ignore
        (this.sprites.get(obj.id) as CircleSprite).onLayoutUpdate(interpolateCoordinates(obj.position), obj.color, obj.destroyed, obj.radius);
        continue;
      }
    }
  }

  protected onDraw(): void {
  }

  protected onLayoutUpdate(): void {
  }
}

