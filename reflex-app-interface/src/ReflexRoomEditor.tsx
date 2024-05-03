import React from 'react';
import { IntegerValidator, StateController, useStateController } from '@bhoos/react-kit-form';
import { FormTextInputLabel } from '@bhoos/super-components';
import { RoomConfig, RoomEditorProps } from '@bhoos/super-app-interface';
import { Reflex } from '@bhoos/reflex-engine';

function validateTimer(interval: number) {
  if (interval === -1) return -1;
  if (interval < 1000) throw new Error('Interval is too low. Must be greater than 1000ms');
  if (interval > 6000) throw new Error('Interval is too high. Must be less than 6000ms');
  return interval;
}

const FormStructure = {
  config: {
    playTimer: new IntegerValidator().custom(validateTimer),
  },
};


export function ReflexRoomEditor({ roomCopy, setRoomController, prefs, updatePrefs }: RoomEditorProps<Reflex>) {
  const ctlr = useStateController(() => {
    const ctlr = new StateController<typeof FormStructure, RoomConfig<Reflex>>(FormStructure, roomCopy);
    setRoomController(ctlr);
    return ctlr;
  });
  const config = ctlr.substate('config');
  return (
    <>
      <FormTextInputLabel inputMode="numeric" label="Pick Timer" controller={config.field('playTimer')} />
    </>
  );
}
