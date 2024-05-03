import { Reflex } from '@bhoos/reflex-engine';
import { RoomViewerProps } from '@bhoos/super-app-interface';
import { DisplayConfigText, formatConfigTimer } from '@bhoos/super-components';
import { View } from 'react-native';

export function ReflexRoomViewer({ room, prefs, updatePrefs }: RoomViewerProps<Reflex>) {
  return (
    <View>
      <DisplayConfigText
        label="Play Interval"
        sublabel="Time allowed for throwing a card"
        value={formatConfigTimer(room.config.playTimer)}
      />
    </View>
  );
}
