import { Match } from '@bhoos/game-kit-engine';
import { testGameLoop } from '@bhoos/game-kit-tests';
import { ReflexState } from '../ReflexState';
import { Reflex, ReflexPlayer, ReflexBot, ReflexConfig, ReflexLoop, registerToOracle } from '..';
import { describe, test, expect } from 'vitest';
import { Oracle } from '@bhoos/serialization';

const DEFAULT_CONFIG: ReflexConfig = {
  playTimer: -1,
};

function createReflexMatch(playersCount: number = 4) {
  const players: ReflexPlayer[] = [];
  for (var idx = 0; idx < playersCount; idx++) {
    players.push({
      id: `${idx}`,
      name: `player${idx}`,
      picture: `${idx}`,
    });
  }

  const match = new Match<Reflex>(players, ReflexState);
  players.map(p => {
    const bot = new ReflexBot(p.id, match);
    match.join(bot);
    return bot;
  });
  return match;
}

describe('Game Loop runs correctly', () => {
  test('game-kit-test succeeds', async () => {
    const oracle = new Oracle();
    registerToOracle(oracle);

    const out = await testGameLoop<Reflex>(
      ReflexState,
      () => createReflexMatch(),
      match => ReflexLoop(match, DEFAULT_CONFIG),
      oracle,
      10,
    );
    if (out != null) console.log(out);
    expect(out).toBeNull();
  });
});
