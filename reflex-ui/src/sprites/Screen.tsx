import { Attribute, Reference, Sprite, timingAnim } from "@bhoos/game-kit-ui";
import { Canvas, Circle, Group, RuntimeShader, Skia, useClock, vec } from "@shopify/react-native-skia";
import { Dimensions, StyleSheet } from "react-native";
import { Animated} from 'react-native';
import { Color, Position } from "@bhoos/reflex-engine/src/ecs/Object";
import { Text } from "react-native";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";

export class ScreenSprite implements Sprite {
  x: number;
  constructor() {
    this.x = Dimensions.get("window").width/2
  }
reactComponent(props?: {} | undefined): JSX.Element {
    return (
        <Canvas style={{height: Dimensions.get("window").height - 27, width: Dimensions.get("window").width, position: "absolute", left: -10, top: -0, backgroundColor: "blue"}} >
        </Canvas>
    )
  }
}

const source = Skia.RuntimeEffect.Make(
  `
uniform shader image;
uniform float  iTime;

float f(vec3 p) {
    p.z -= iTime * 10.;
    float a = p.z * .1;
    p.xy *= mat2(cos(a), sin(a), -sin(a), cos(a));
    return .1 - length(cos(p.xy) + sin(p.yz));
}

float julia(vec2 uv, vec2 c) {
    const float maxSteps = 400;
    for (float i = 0; i < maxSteps; i++) {
        uv = vec2(uv.x * uv.x - uv.y * uv.y + c.x,
                  2.0 * uv.x * uv.y + c.y);
        if (length(uv) > 2) {
            return i / maxSteps;
        }
    }
    return 1.0;
}

half4 main(float2 xy) {
    float2 center = float2(1, 1); // Circle center
    float radius = 0.3 + 0.1 * sin(iTime); // Radius of the circle, oscillates over time

    // Calculate distance from center
    float dist = length(xy - center);

    float3 color;
    half4 final;
    if (image.eval(xy).rgb == float3(1)) {

    vec2 uv = xy;

    uv *= pow(0.5, -1.0 + 15.0 * (0.5 + 0.5 * sin(iTime * 0.00080 - (3.14159265))));
    uv += vec2(-0.51, -0.61351); // an interesting coordinate to zoom in on 
    float f = julia(vec2(0.0, 0.0), uv);
    
      final = vec4((1.0 - uv) * pow(f, 0.5), f, 1.0);
}
else {
color = float3(0, 0, 0); // Outside color (Blue)
final = half4(color, 0);
}

    return final;
}
`
)!;

const colors1= ["#ff0000", "#ff0000", "#fb61da", "#61fbcf"].map((c) =>
Skia.Color(c)
);

export function interpolateCoordinates(position: Position) {
  return {x: interpolateValue(position.x), y: interpolateValue(position.y)};
  return {x: position.x * (Dimensions.get("window").height/1000), y: position.y * (Dimensions.get("window").height/1000)}
}

export function interpolateValue(x:number) {
  return x * (Math.min(Dimensions.get("window").height, Dimensions.get("window").width)/ 1000);
}

export class CircleSprite implements Sprite {
  position: {
    x: Attribute,
    y: Attribute
  };
  ref: Reference<Color>;
  animated = new Attribute(0);
  oparef = new Attribute(1);
  scale = new Attribute(1);
  radiusRef: Reference<number>;
  radius: number;
  id: number;
  constructor(radius: number,position: Position, color: Color, id: number) {
    this.position = {
      x: new Attribute(position.x),
      y: new Attribute(position.y)
    };
    this.radius = radius;
    this.id = id;
    this.ref = new Reference(color);
    this.radiusRef = new Reference(this.radius);
  }
  onLayoutUpdate(position: Position, color: Color, destroyed: boolean, radius: number) {
    this.position.x.animateTo(position.x - radius, timingAnim({duration: 35, useNativeDriver: true}))
    this.position.y.animateTo(position.y - radius, timingAnim({duration: 35, useNativeDriver: true}))
    this.scale.animateTo(radius/50, timingAnim({duration: 50, useNativeDriver: true}));
    this.radius = radius;
    this.ref.setValue(color);
    this.radiusRef.setValue(this.radius);
    this.oparef.setValue(destroyed ? 0 : 1);
  }
  reactComponent(props?: {} | undefined): JSX.Element {
    const _ = Reference.use(this.ref);
    const radiusRef = Reference.use(this.radiusRef);
    const colors = ["#ff0", "#0ff", "#ff0", "#f0f"]
    const clock = useClock();
    const uniforms = useDerivedValue(() => ({ iTime: clock.value }), [clock]);
    return (
    <Animated.View {...props} style= {[StyleSheet.absoluteFill, { transform: [{translateX: this.position.x.animated}, {translateY: this.position.y.animated } ], opacity: this.oparef.animated }]} >
        <Canvas style={{ height: this.radiusRef.value * 2, width: this.radiusRef.value * 2 }}>
          <Group>
            <Circle cx={this.radiusRef.value} cy={this.radiusRef.value} r={this.radiusRef.value} color={colors[_]} />
          </Group>
        </Canvas>
      </Animated.View>
    )
  }
}

const SingleNode = ()=> {
  const ref = new Reference(0);
  function updateLayout() {
    ref.setValue(ref.value + 1);
  }
}

