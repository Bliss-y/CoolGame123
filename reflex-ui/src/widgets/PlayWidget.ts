import { SpriteManager, Widget, setLayout } from "@bhoos/game-kit-ui";
import { ButtonSprite } from "../sprites";

type Layout = {
  x: number,
  y: number,
  zIndex: number
};

type State = {
  active: boolean
}

type CBs = {
  onPlay: () => void;
}
export class PlayWidget extends Widget<Layout, State, SpriteManager> {
  private button: ButtonSprite;

  constructor(
    sm: SpriteManager,
    computeLayout: () => Layout,
    computeState: () => State,
    cb: CBs
  ) {
    super(sm, computeLayout, computeState);
    this.button = sm.registerSprite(new ButtonSprite({
      title: "Increase",
      onClick: cb.onPlay,
      color: 'blue'
    }));
  }

  protected onDraw(): void {
    setLayout(this.button, this.layout);
    this.button.enabled.setValue(this.state.active);
  }

  protected onLayoutUpdate(): void {
    setLayout(this.button, this.layout);
  }
}
