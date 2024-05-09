import { Sprite } from "@bhoos/game-kit-ui";
import { Canvas, Circle, Group, Rect, RuntimeShader, Skia, useClock, vec } from "@shopify/react-native-skia";
import { Dimensions, StyleSheet } from "react-native";
import  { useDerivedValue } from "react-native-reanimated";
import { View } from "react-native";

let source = Skia.RuntimeEffect.Make(
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
    } else {
        color = float3(0, 0, 0); // Outside color (Blue)
        final = half4(color, 0);
    }

    color = float3(0, 0, 0); // Outside color (Blue)
    final = half4(color, 1);
    return final;
}
`
)!;


source = Skia.RuntimeEffect.Make(
`
uniform float2 u_resolution;
uniform float iTime;
uniform shader image;

half4 main(float2 xy) {
  float3 color = float3(0, 0, 0); // Outside color (Blue)
  vec4 final = half4(color, 1);
  if(u_resolution.x > xy.x) {
   return half4(0,1,1,1);
  }
 return half4(1,1,1,1);
}`)!;

source = Skia.RuntimeEffect.Make(
`
uniform shader image;
uniform float2 u_resolution;
uniform float iTime;
float random (in float2 _st) {
 return fract(sin(dot(_st.xy,
 float2(12.9898,78.233)))*
 43758.5453123);
}
// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in float2 _st) {
 float2 i = floor(_st);
 float2 f = fract(_st);
// Four corners in 2D of a tile
 float a = random(i);
 float b = random(i + float2(1.0, 0.0));
 float c = random(i + float2(0.0, 1.0));
 float d = random(i + float2(1.0, 1.0));
float2 u = f * f * (3.0 - 2.0 * f);
return mix(a, b, u.x) +
 (c - a) * u.y * (1.0 - u.x) +
 (d - b) * u.x * u.y;
}
float fbm ( in float2 _st) {
 float v = 0.0;
 float a = 0.5;
 float2 shift = float2(100.0);
 // Rotate to reduce axial bias
 float2x2 rot = float2x2(cos(0.5), sin(0.5),
 -sin(0.5), cos(0.50));
 for (int i = 0; i < 5; ++i) {
 v += a * noise(_st);
 _st = rot * _st * 2.0 + shift;
 a *= 0.5;
 }
 return v;
}
half4 main(float2 fragCoord) {
 float2 st = fragCoord.xy/u_resolution.xy*3.;
 // st += st * abs(sin(iTime*0.01)*3.0);
 float3 color = float3(0.0);
float2 q = float2(0.);
 q.x = fbm( st + 0.00*iTime);
 q.y = fbm( st + float2(1.0));
float2 r = float2(0.);
 r.x = fbm( st + 1.0*q + float2(1.7,9.2)+ 0.015*iTime );
 r.y = fbm( st + 1.0*q + float2(8.3,2.8)+ 0.0126*iTime);
float f = fbm(st+r);
color = mix(float3(0.101961,0.619608,0.666667),
 float3(0.666667,0.666667,0.498039),
 clamp((f*f)*4.0,0.0,1.0));
color = mix(color,
 float3(0,0,0.164706),
 clamp(length(q),0.0,1.0));
color = mix(color,
 float3(0.666667,1,1),
 clamp(length(r.x),0.0,1.0));
return half4((f*f*f+.6*f*f+.5*f)*color,1.);
}
`
)!;

export class BackgroundSprite implements Sprite {
  reactComponent(props?: {} | undefined): JSX.Element {
    const res = vec(100.0,200.0)
    const clock = useClock();
    const uniforms = useDerivedValue(() => ({u_resolution: res, iTime: clock.value/20 }), [clock, res]);
      return (
      <View style= {StyleSheet.absoluteFill}>
        <Canvas style={{height: '100%', width: '100%',  }}>
        <Group>
          <RuntimeShader source={source} uniforms={uniforms} ></RuntimeShader>
          <Rect height={Dimensions.get('window').width} width={Dimensions.get('window').height} color="#ff0000">
          </Rect>
        </Group>
        </Canvas>
        </View>
      )
  }
}
