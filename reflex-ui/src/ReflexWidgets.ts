import { REFLEX_STAGE_PLAY, ReflexConfig } from '@bhoos/reflex-engine';
import { CoordinateSystem, SpriteManager } from '@bhoos/game-kit-ui';
import { ReflexUI } from './ReflexUI';
import { PlayerWidget } from './widgets/PlayerWidget';
import { PlayWidget } from './widgets';

export function computeLayouts(dimensions: CoordinateSystem) {
  const profiles: PlayerWidget['layout'][] = [
    { x: 0, y: 0 }, // 1
    { x: 50, y: 0 }, // 2
    { x: 100, y: 0 }, // 3
    { x: 150, y: 0 }, // 4
  ];

  const playButton: PlayWidget['layout'] = {
    x: -100,
    y: 0,
    zIndex: 500
  }
  return {
    profiles,
    playButton,
  };
}

export type ReflexLayouts = ReturnType<typeof computeLayouts>;

function createPlayerWidget(sm: SpriteManager, ui: ReflexUI, offset: number) {
  return new PlayerWidget(
    sm,
    () => {
      return ui.layouts.profiles[offset];
    },
    () => {
      const state = ui.state;
      const playerIdx = (offset + state.userIdx) % state.players.length;
      const player = state.players[playerIdx];
      if (!player) {
        console.log(ui.state);
        throw new Error(`Invalid playerIdx ${playerIdx} ${ui.state}`);
      }
      return {
        isWinner: state.winnerIdx === playerIdx,
        profile: player,
      } as PlayerWidget['state'];
    },
  );
}

export function createWidgets(ui: ReflexUI, sm: SpriteManager, config: ReflexConfig) {
  return {
    profiles: [
      createPlayerWidget(sm, ui, 0),
      createPlayerWidget(sm, ui, 1),
      createPlayerWidget(sm, ui, 2),
      createPlayerWidget(sm, ui, 3),
    ],
    playButton: new PlayWidget(
      sm,
      () => ui.layouts.playButton,
      () => {
        return {
          active: ui.state.stage === REFLEX_STAGE_PLAY
        }
      },
      {
        onPlay: ui.onUserPlay
      })
  };
}
