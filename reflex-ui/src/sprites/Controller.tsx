import { Attribute, Reference, Sprite, ZIndex } from '@bhoos/game-kit-ui';
import React, { useRef } from 'react';
import { Dimensions, GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
import { Canvas, Rect } from '@shopify/react-native-skia';
import { View } from 'react-native';

type EventCallBack = (event: GestureResponderEvent) => void;


export class ControllerSprite implements Sprite {
  x = new Attribute(0);
  y = new Attribute(0);
  zIndex: ZIndex = new ZIndex();

  private onClick: EventCallBack;
  private touchStart: EventCallBack;
  private touchEnd: EventCallBack;
  private touchMove: EventCallBack;
  constructor({ onClick, touchStart, touchEnd, touchMove }: { onClick: EventCallBack; touchStart: EventCallBack; touchEnd: EventCallBack; touchMove: EventCallBack}) {
    this.onClick = onClick;
    this.touchStart = touchStart;
    this.touchEnd = touchEnd;
    this.touchMove = touchMove;
  }

  reactComponent(): JSX.Element {
    // <Rect height={800} width= {1000} />
    return (
      <View style= {StyleSheet.absoluteFill}>
      <Pressable  onTouchMove={this.touchMove} onTouchStart={this.touchStart} onPress={this.onClick} onTouchEnd={this.touchEnd}>
        <Canvas style = {{height: "100%", width: "100%", left: 0, top: 1, opacity: 0.051}}>
            <Rect height={Dimensions.get("window").height} width={Dimensions.get("window").width} color={"blue"}></Rect>
        </Canvas>
      </Pressable>
      </View>
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

