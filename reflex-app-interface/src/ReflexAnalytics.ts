import { REFLEX_STAGE_END, REFLEX_STAGE_PLAY, REFLEX_STAGE_START, Reflex, ReflexState } from '@bhoos/reflex-engine';
import { GameAppAnalyticsInterface, AnalyticsGameStageIdentifiers } from '@bhoos/super-app-interface';

export const ReflexAnalytics: GameAppAnalyticsInterface<Reflex> = {
  gameConfigId: room => `timer:${room.config.playTimer}`,
  gameExitStage: state => `st:${formatStage(state.stage)}`,
};

function formatStage(stage: ReflexState['stage']) {
  if (stage === REFLEX_STAGE_END) return AnalyticsGameStageIdentifiers.matchEnd;
  if (stage === REFLEX_STAGE_START) return AnalyticsGameStageIdentifiers.matchStart;
  return AnalyticsGameStageIdentifiers.failSafe;
}
