import { SpriteManager, Widget, setLayout, Sprite } from "@bhoos/game-kit-ui";
import { ReflexState } from "@bhoos/reflex-engine";
import { Circles } from "@bhoos/reflex-engine/src/ecs/Object";
import { Dimensions } from "react-native";
import { BackgroundSprite, ForeGroundSprite, RenderableObject } from "../sprites/BackgroundSprite";
import { CircleSprite, interpolateCoordinates, interpolateValue, ScreenSprite } from "../sprites/Screen";

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
  backGroundSprite: BackgroundSprite;
  foregroundSprite: ForeGroundSprite;

  constructor(
    sm: SpriteManager,
    initialState: ReflexState,
    computeLayout: () => Layout,
    computeState: () => State,
  ) {
    super(sm, computeLayout, computeState);
    const renderableObjects: RenderableObject[] = [];
    for (let i = 0; i < 14; i++) {
      renderableObjects.push([0, 0, 0, 0]);
    }
    this.backGroundSprite = new BackgroundSprite();
    this.foregroundSprite = new ForeGroundSprite(renderableObjects);
    this.sm.registerSprite(this.backGroundSprite);
    this.sm.registerSprite(this.foregroundSprite);
    return;
    for (let i = 0; i < 14; i++) {
      continue;
      const spr = new CircleSprite(i < 4 ? interpolateValue(50) : interpolateValue(10), { x: 0, y: 0 }, Math.floor(Math.random() * 3) + 1, i);
      this.sprites.set(i, spr);
      this.sm.registerSprite(spr);
    }
  }

  onGameUpdate(state: ReflexState) {
    const renderableObjects: RenderableObject[] = [];
    for (const obj of state.objects) {
      if (!obj.destroyed) {
        renderableObjects.push([obj.position.x / 1000, obj.position.y / 1000, obj.radius / 1000, (obj as Circles).color / 10])
      } else {
        renderableObjects.push([0, 0, 0, 0])
      }
      continue;
    }
    for (let i = renderableObjects.length; i < 14; i++) {
      renderableObjects.push([0, 0, 0, 0]);
    }
    this.foregroundSprite.updateLayout(renderableObjects as RenderableObject[]);
  }

  protected onDraw(): void {
  }

  protected onLayoutUpdate(): void {
  }
}

