import { Reference, Sprite } from "@bhoos/game-kit-ui";
import { Canvas, Circle, Group, JsiSkImage, Rect, RuntimeShader, Skia, useClock, vec } from "@shopify/react-native-skia";
import { Dimensions, StyleSheet } from "react-native";
import  { useDerivedValue, useSharedValue } from "react-native-reanimated";
import { View } from "react-native";

let source = Skia.RuntimeEffect.Make(
`
uniform shader image;
uniform vec2 iResolution;
uniform float iTime;
float N21(vec2 p)
{
    p = fract(p * vec2(6574.5414, 8961.8778));
    p += dot(p, p + 23.45);
    return fract(p.x * p.y);
}
vec2 N22(vec2 p)
{
    float x = N21(p);
    float y = N21(p + x);
    return vec2(x, y);
}
vec2 GetPos(vec2 id)
{
    vec2 n = N22(id) * 24.;
    return sin(n) * .4;
}
float sn(vec2 uv)
{
    vec2 lv = fract(uv * 10.0);
    vec2 id = floor(uv * 10.0);

    lv = lv * lv * (3. - 2. * lv);

    float bl = N21(id);
    float br = N21(id +vec2(1, 0));
    float b = mix(bl, br, lv.x);

    float tl = N21(id + vec2(0,1));
    float tr = N21(id +vec2(1, 1));
    float t = mix(tl, tr, lv.x);

    return mix(b, t, lv.y);
}
float stars(vec2 uv)
{

    vec2 gv = fract(uv) - 0.5;
    vec2 id = floor(uv);
    vec2 pos = GetPos(id);
    float distance = length(gv - pos);
    float shineRate = abs(sin(iTime * 0.8 * N21(id)));

    float star = smoothstep(0.06, clamp(0.9 - sqrt(iTime / 10.0), 0.001, 0.059), distance) * shineRate;
    return star - 0.15;
}

vec3 animate(vec2 uv)
{
    float zoomout = sqrt((iTime * 5.25));
    float andromedaFade = sqrt(iTime / 1.);
    uv *= clamp(zoomout, 0.0, 1.8);

    vec3 spaceCol = vec3(0.0, 0.0, 0.10);
    vec3 andromedaColPink = vec3(0.8, 0.0, 0.7);
    vec3 andromedaColGreen = vec3(0.2, 0.9, 0.2);

    spaceCol += stars(uv);

    vec2 androUV = uv;
    float s = sin(iTime * 0.08);
    float c = cos(iTime * 0.08);
    mat2 rotmat = mat2(c, -s, s, c);
    //androUV -= iTime * 0.2;
    androUV *= rotmat;
    float andromedaPinkNoise = sn(androUV * 0.03) * clamp(andromedaFade, 0.0, 1.6);
    andromedaPinkNoise += sn(androUV * 0.25) * 0.125;
    andromedaPinkNoise += sn(androUV * 0.125) * 0.625;
    andromedaPinkNoise /= 5.0;
    spaceCol +=  mix(spaceCol, andromedaColPink, andromedaPinkNoise);


    s = sin(iTime * 0.03);
    c = cos(iTime * 0.03);
    rotmat = mat2(c, s, -s, c);
    vec2 androUV2 = uv;
    androUV2.y += iTime * 0.3;
    androUV2 *= rotmat;
    float andromedaGreenNoise = sn(androUV2 * 0.03) * clamp(andromedaFade, 0.0, 1.6);
    andromedaGreenNoise += sn(androUV2 * 0.25) * 0.125;
    andromedaGreenNoise += sn(androUV2 * 0.125) * 0.625;
    andromedaGreenNoise /= 3.0;
    spaceCol +=  mix(spaceCol, andromedaColGreen, andromedaGreenNoise);

    return spaceCol;
}

vec4 main(in vec2 fragCoord )
{
    vec2 uv = (fragCoord.xy - 0.5 * iResolution.xy) / iResolution.y * 10.;
    vec3 col = animate(uv);
    return vec4(col, 1.0);
}
`)!;

const objects = [[0.2, 0.2, 0.5, 0.5], [0.3, 0.3, 0.1, 0.8]];
const shader2 = Skia.RuntimeEffect.Make(
`
uniform shader image;
uniform vec4 objects[14];
uniform vec2 iResolution;
vec4 circle(vec2 uv, vec2 pos, float rad, vec3 color) {
	float d = length(pos - uv) - rad;
	float t = clamp(d, 0.0, 1.0);
	return vec4(color, 1.0 - t);
}
vec4 main(  in vec2 fragCoord )
{
  vec4 fragColor;
    // Normalized pixel coordinates (from 0 to 1)
    fragColor = vec4(0.0,0.0,0.,0.);
    vec2 p = (2.0*fragCoord-iResolution.xy)/iResolution.y;
    for(int i=0;i<14;++i)
    {
        vec3 color;
        if(objects[i][3] == 0.1) {
          color = vec3(0.98,0.,0.);
        }
        if(objects[i][3] == 0.2) {
          color = vec3(0.,0.9,0.);
        }
        if(objects[i][3] == 0.3) {
          color = vec3(0.,0.,1.);
        }
        vec4 sobj = circle(fragCoord.xy, iResolution.xy * objects[i].xy, iResolution.x * objects[i][2], color/2);
        fragColor = mix(fragColor, sobj, sobj.a);
    }
  return fragColor;
}
`
)!;


export type RenderableObject = [number, number, number, number]

export class BackgroundSprite implements Sprite {
  reactComponent(props?: {} | undefined): JSX.Element {
    const clock = useClock();
    const res = vec(Math.min(Dimensions.get('window').height,Dimensions.get('window').width),Math.min(Dimensions.get('window').height,Dimensions.get('window').width))
    const uniforms = useDerivedValue(() => ({ iTime: clock.value/2000, iResolution: res}), [clock, res]);
      return (
      <View style= {StyleSheet.absoluteFill}>
        <Canvas style={{height: '100%', width: '100%'}}>
        <Group>
          <RuntimeShader source={source} uniforms={uniforms} ></RuntimeShader>
          <Rect height={Dimensions.get('window').width} width={Dimensions.get('window').height}>
          </Rect>
        </Group>
        </Canvas>
        </View>
      )
  }
}

export class ForeGroundSprite implements Sprite {
  ref: Reference<RenderableObject[]>;
  constructor(objects: RenderableObject[]) {
    this.ref = new Reference(objects);
  }
  updateLayout(objects: RenderableObject[]) {
    this.ref.setValue(objects);
  }
  reactComponent(props?: {} | undefined): JSX.Element {
    const res = vec(Math.min(Dimensions.get('window').height,Dimensions.get('window').width),Math.min(Dimensions.get('window').height,Dimensions.get('window').width))
    const clock = useClock();
    const ref = Reference.use(this.ref);
    const uniforms = useDerivedValue(() => ({iResolution: res, iTime: clock.value, objects: [...ref]}), [[...ref], res]);
      return (
      <View style= {StyleSheet.absoluteFill}>
        <Canvas style={{height: '100%', width: '100%'}}>
        <Group>
          <RuntimeShader source={shader2} uniforms={uniforms} ></RuntimeShader>
          <Rect height={Dimensions.get('window').width} width={Dimensions.get('window').height}>
          </Rect>
        </Group>
        </Canvas>
        </View>
      )
  }
}
