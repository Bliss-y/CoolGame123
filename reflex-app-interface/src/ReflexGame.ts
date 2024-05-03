import { Reflex, ReflexBot, ReflexConfig, ReflexLoop, ReflexPlayer, ReflexState, registerToOracle } from '@bhoos/reflex-engine';
import {
  GameAppInterface,
  Prefs,
  RoomConfig,
  RoomType,
  SuperAppInterfaceVersion,
  UIPlugins,
  UserProfile,
  versionLt,
} from '@bhoos/super-app-interface';
import { CoordinateSystem, ReferenceMultiple } from '@bhoos/game-kit-ui';
import { Match } from '@bhoos/game-kit-engine';
import { HotspotRoomConfig, SinglePlayerRoomConfig } from '@bhoos/super-app-interface';
import { ReflexRoomEditor } from './ReflexRoomEditor';
import { SuperReflexUI } from './SuperReflexUI';
import { BOTS } from './bots';
import { ReflexRoomViewer } from './ReflexRoomViewer.js';
import { ReflexAnalytics } from './ReflexAnalytics.js';
import { ReflexHelp } from './ReflexHelp';
import { computeReflexStats } from './ReflexStats';
import { computeReflexWinnings } from './ReflexWinnings';

const pkg = require('../package.json');

const DEFAULT_CONFIG: ReflexConfig = {
  playTimer: -1,
};

const SINGLE_PLAYER_DEFAULT_ROOM: SinglePlayerRoomConfig<Reflex> = {
  id: 'reflex-sp-default',
  name: 'Default',
  config: DEFAULT_CONFIG,
  roomType: RoomType.Single,
  minPlayers: 2,
  maxPlayers: 4,
  boot: 10,
  buyIn: 10,
};

const HOTSPOT_DEFAULT_ROOM: HotspotRoomConfig<Reflex> = {
  id: 'reflex-hot-default',
  name: 'Default',
  config: DEFAULT_CONFIG,
  roomType: RoomType.Hotspot,
  minPlayers: 2,
  maxPlayers: 4,
  boot: 10,
  buyIn: 10,
};

export type ReflexPrefs = {
  sound: boolean;
  vibration: boolean;
};

export function initializeReflexGame(): GameAppInterface<Reflex> {
  return {
    gameId: pkg.bhoos.gameId,
    displayName: 'Reflex',
    name: 'reflex',
    version: pkg.version,
    interfaceVersion: SuperAppInterfaceVersion,
    developer: 'Bibek Panthi',
    isHostSupported: (version: string) => {
      return !versionLt(version, '1.0.0');
    },
    isClientSupported: (version: string) => {
      return !versionLt(version, '1.0.0');
    },
    reloadStorage: (version: string) => {
      return versionLt(version, '1.0.0');
    },
    description: 'Click as fast as you can',
    supportedBots: Object.keys(BOTS),
    initialSPBots: ['babita', 'pramod'],

    initializeStorage: () => {
      return {
        rooms: [SINGLE_PLAYER_DEFAULT_ROOM, HOTSPOT_DEFAULT_ROOM],
      };
    },

    isValidProfile: (_player: ReflexPlayer, _room: RoomConfig<Reflex>) => true,

    prefs: {
      sound: true,
      vibration: true,
    },

    getPlayer: (profile: UserProfile) => {
      return {
        id: profile.id,
        name: profile.name,
        picture: profile.picture,
      } as ReflexPlayer;
    },

    getBotPlayer: (id: string) => {
      const player = BOTS[id];
      if (player) return player;

      return {
        id: id,
        name: `id`,
        picture: `${id}`,
      };
    },

    defaultRooms: {
      singleplayer: SINGLE_PLAYER_DEFAULT_ROOM,
      hotspot: HOTSPOT_DEFAULT_ROOM,
    },

    RoomEditorComponent: ReflexRoomEditor,
    RoomViewerComponent: ReflexRoomViewer,
    HelpComponent: ReflexHelp,
    analytics: ReflexAnalytics,

    getConfigSummary(room: RoomConfig<Reflex>) {
      const config = room.config;
      if (room.roomType === RoomType.Multi) {
        return {
          short: '',
          details: [
            ['Stakes', `${room.boot}`, 'coins'],
          ],
        };
      }
      return {
        short: `${config.playTimer / 1000} secs`,
        details: [['Time', `${config.playTimer / 1000} secs`, 'time']],
      };
    },

    ui: {
      layoutProps: () => {
        return {
          bgImage: '/backgrounds/table/default',
        };
      },

      createUI: (
        layout: CoordinateSystem,
        roomConfig: RoomConfig<Reflex>,
        _prefs: ReferenceMultiple<Prefs>,
        plugins: UIPlugins<Reflex>,
      ) => {
        return new SuperReflexUI(layout, roomConfig, plugins);
      },

      orientation: 'landscape',
      testEquality: (_u, _v) => true,
      startGameMethod: 'onStartGame',
      finishGameMethod: 'onFinishGame',
    },

    engine: {
      gameConfig: (room: RoomConfig<Reflex>, players: ReflexPlayer[], _prev?: { match: Match<Reflex>; config: ReflexConfig }) => {
        return {
          config: room.config,
          players: players,
        };
      },

      State: ReflexState,
      gameLoop: ReflexLoop,

      registerToOracle: registerToOracle,

      createBot: (match: Match<Reflex>, player: ReflexPlayer) => {
        return new ReflexBot(player.id, match)
      },
    },

    stats: {
      matchWinnings: computeReflexWinnings,

      matchStats: computeReflexStats,

      engineModeId: (_room: RoomConfig<Reflex>) => {
        return 1;
      },

      timezone: 'UTC',

      statFullId: [],
      descriptions: new Map(),

      formatters: new Map(),
    },

    achievements: [],

    assets: {
      pathTranslations: [],
      assets: require('./assetsManifest.json')
    }
  }
}
