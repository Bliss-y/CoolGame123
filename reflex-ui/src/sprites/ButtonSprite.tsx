import { Attribute, Reference, Sprite, ZIndex } from '@bhoos/game-kit-ui';
import React from 'react';
import { GameButton } from '@bhoos/games-ui';
import { Animated } from 'react-native';

type CallBack = () => void;
export class ButtonSprite implements Sprite {
  text: Reference<string> = new Reference('');
  enabled: Reference<boolean> = new Reference(true);
  x = new Attribute(0);
  y = new Attribute(0);
  zIndex: ZIndex = new ZIndex();

  private onClick: CallBack;
  private color: string;
  constructor({ title, onClick, color }: { title: string; onClick: CallBack; color: string }) {
    this.text.setValue(title);
    this.onClick = onClick;
    this.color = color;
  }

  reactComponent(props?: {}): JSX.Element {
    const text = Reference.use(this.text);
    const enabled = Reference.use(this.enabled);

    return (
      <Animated.View {...props} ref={this.zIndex.ref} style={this.layoutStyles}>
        <GameButton onClick={this.onClick} enabled={enabled} color={this.color} hitSlop={10}>
          {text}
        </GameButton>
      </Animated.View>
    );
  }

  private layoutStyles = {
    transform: [
      { translateX: this.x.animated },
      { translateY: this.y.animated },
    ],
    position: 'absolute' as 'absolute',
  };
}
