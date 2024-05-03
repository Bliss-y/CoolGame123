import { CoordinateSystem, ReferenceMultiple, UI, UIActionReturn } from '@bhoos/game-kit-ui';
import { REFLEX_STAGE_END, Reflex, FinishGameAction } from '@bhoos/reflex-engine';
import { ReflexUI } from '@bhoos/reflex-ui';
import { Prefs, RoomConfig, SuperUIEnv, UIPlugin, UIPlugins, pluginToUI } from '@bhoos/super-app-interface';
import { UITestPlugin } from '@bhoos/super-components';
import { computeReflexWinnings } from './ReflexWinnings';

export class SuperReflexUI extends ReflexUI implements UI<Reflex, SuperUIEnv<Reflex>> {
  constructor(
    layout: CoordinateSystem,
    roomConfig: RoomConfig<Reflex>,
    plugins: UIPlugins<Reflex>,
  ) {
    super(layout, roomConfig.config);
    const ui = this;
    function plug(plugin: UIPlugin<Reflex, SuperUIEnv<Reflex>>) {
      pluginToUI<Reflex, SuperUIEnv<Reflex>>(ui, plugin, 'onStartGame', 'onFinishGame');
    }

    const sm = this.getSpriteManager();
    if (plugins.coins) {
      plug(plugins.coins(sm, () => computeReflexWinnings(this.state, roomConfig, this.state.userIdx)));
    }

    if (plugins.hotspotPin) {
      plug(plugins.hotspotPin(sm));
    }

    if (plugins.menu) {
      plug(plugins.menu(sm, () => this.state && this.state.stage === REFLEX_STAGE_END));
    }

    if (plugins.leaderboard) {
      plug(plugins.leaderboard(sm));
    }

    plug(new UITestPlugin());
  }
}
