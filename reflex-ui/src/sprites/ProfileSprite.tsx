import { Attribute, Reference, Sprite, ZIndex } from '@bhoos/game-kit-ui';
import { Avatar, NameTag } from '@bhoos/games-ui';
import React from 'react';
import { Animated, Text } from 'react-native';

export type ProfileSpriteProfile = {
  name: string;
  picture: string;
  clickCount: number;
};

export class ProfileSprite implements Sprite {
  readonly profile: Reference<ProfileSpriteProfile>;

  x = new Attribute(0);
  y = new Attribute(0);
  zIndex: ZIndex = new ZIndex();
  opacity = new Attribute(0);

  constructor() {
    this.profile = new Reference<ProfileSpriteProfile>({
      name: 'default',
      picture: '0',
      clickCount: 0
    });
  }

  reactComponent(props: {}): JSX.Element {
    const profile = Reference.use(this.profile);

    return (
      <Animated.View ref={this.zIndex.ref} {...props} style={this.layoutStyles}>
        <Avatar glow={false} path={profile.picture} style={{ top: 10 }} size={52} />
        <Text>{profile.clickCount}</Text>
        <NameTag name={profile.name} />
      </Animated.View>
    );
  }

  private layoutStyles = {
    transform: [
      { translateX: this.x.animated },
      { translateY: this.y.animated },
    ],
    position: 'absolute' as 'absolute',
    opacity: this.opacity.animated
  }
}
