import { CoordinateSystem, Environment, SpriteManager, UI, UIActionReturn, timingAnim } from '@bhoos/game-kit-ui';
import {
  FinishGameAction,
  Reflex,
  ReflexState,
  PlayAction,
  PlayApi,
  StartGameAction,
} from '@bhoos/reflex-engine';
import { ReflexLayouts, computeLayouts, createWidgets } from './ReflexWidgets';
import { ConfigOf } from '@bhoos/game-kit-engine/src/Game';

const ANIMATION_SPEED = 1;
const FLIP_SPEED_300 = ANIMATION_SPEED * 300;
const timing500 = timingAnim({ duration: ANIMATION_SPEED * 500, useNativeDriver: true });
const timing300 = timingAnim({ duration: ANIMATION_SPEED * 300, useNativeDriver: true });
const timing200 = timingAnim({ duration: ANIMATION_SPEED * 200, useNativeDriver: true });

export type ReflexUIEnv = Environment<Reflex>;

export class ReflexUI implements UI<Reflex, ReflexUIEnv> {
  protected sm: SpriteManager;
  public state!: ReflexState;
  protected env!: ReflexUIEnv;

  public layouts: ReflexLayouts;
  private _layout: CoordinateSystem;
  private widgets;

  constructor(layout: CoordinateSystem, config: ConfigOf<Reflex>) {
    console.log('Creating UI');
    this._layout = layout;
    this.sm = new SpriteManager(layout);
    this.layouts = computeLayouts(layout);
    this.widgets = createWidgets(this, this.sm, config);
    return this;
  }

  /// INTERACTION WITH GAME CLIENT
  onMatchEnd(): void {}

  onBackLog(backLog: number, catchup: () => Promise<void>): void {}

  async onStateUpdate() {
    for (let i = 0; i < this.state.players.length; i++) {
      this.widgets.profiles[i].draw();
    }
    this.widgets.playButton.draw();
  }

  getSpriteManager(): SpriteManager {
    return this.sm;
  }

  onLayoutUpdate(layout: CoordinateSystem) {
    this.widgets.profiles.forEach(p => p.updateLayout());
  }

  onAttach(env: ReflexUIEnv) {
    console.log('Attaching UI');
    this.state = env.client.getState();
    this.env = env;
    return true;
  }

  onDetach(): void {}

  /// EVENT CONSUMER
  onTimer(): void {}

  onConnectionStatus(): void {}

  // USER INTERACTION
  async onUserPlay() {
    this.env.client.execute(PlayApi.create(this.state.userIdx)).catch(console.error);
  }

  // ACTION HANDLERS
  async onStartGame(action: StartGameAction) {
    return async () => {
      for (let i = 0; i < this.state.players.length; i++) {
        this.widgets.profiles[i].draw();
      }
      this.widgets.playButton.draw();
    };
  }

  onPlay(action: PlayAction): UIActionReturn {
    return () => {
      const offset = (action.playerIdx - this.state.userIdx + this.state.players.length) % this.state.players.length;
      this.widgets.profiles[offset].draw();
    }
  }

  onFinishGame(action: FinishGameAction): UIActionReturn {
    () => {
      const offset = (action.winnerIdx - this.state.userIdx + this.state.players.length) % this.state.players.length;
      this.widgets.profiles[offset].draw();
      this.widgets.playButton.draw();
    }
  }

}
