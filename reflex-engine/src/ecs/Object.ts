export type Position = {
  x: number,
  y: number
}

export abstract class GameObject {
  static OBJECT_ID = 0;
  id: number;
  position: Position;
  radius: number;
  destroyed = false;
  constructor(position: Position, radius: number) {
    this.id = GameObject.OBJECT_ID++;
    this.position = position;
    this.radius = radius;
  }
  update(dt: number): void {
    return;
  }
}

export interface Controlled {
  input: Position;
}

export class Circles extends GameObject implements EdibleImpl, Controlled {
  movingDirection = { x: 0, y: 0 };
  input: Position = { x: 0, y: 0 };
  color: Color;
  movingSpeed = { x: 0, y: 0 };
  health = 10;
  private static MAX_HEALTH = 100;
  constructor(position: Position, radius: number) {
    super(position, radius);
    this.color = Math.floor(Math.random() * 3) + 1;
  }

  update(dt: number): void {
    this.movingSpeed = { x: Math.floor(this.input.x * 15), y: Math.floor(this.input.y * 15) }
    if (this.health <= 0) {
      this.destroyed = true;
    }
    if (this.position.x + this.radius >= 1000 && this.movingSpeed.x > 0) {
      this.movingSpeed.x = 0;
    }
    if (this.position.x - this.radius <= 0 && this.movingSpeed.x < 0) {
      this.movingSpeed.x = 0;
    }
    if (this.position.y + this.radius >= 1000 && this.movingSpeed.y > 0) {
      this.movingSpeed.y = 0;
    }
    if (this.position.y - this.radius <= 0 && this.movingSpeed.y < 0) {
      this.movingSpeed.y = 0;
    }
    this.position.x = this.position.x + this.movingSpeed.x;
    this.position.y = this.position.y + this.movingSpeed.y;
  }

  onEat(eater: EdibleImpl, eaten: EdibleImpl): void {
    this.color = eaten.color;
  }
}

export class Food extends GameObject implements EdibleImpl {
  color: Color;
  timeLeft = 0;
  constructor(position: Position, radius: number) {
    super(position, radius);
    this.color = Math.floor(Math.random() * 3) + 1;
  }
  update(dt: number): void {
    if (this.timeLeft == 0 && this.destroyed) {
      console.log("spawning at", this.position, this.id);
      this.destroyed = false;
      return;
    }
    this.timeLeft--;
  }
  onEat(eater: EdibleImpl, eaten: EdibleImpl): void {
    this.position.x = Math.floor(Math.random() * 1000);
    this.position.y = Math.floor(Math.random() * 1000);
    this.color = Math.floor(Math.random() * 3) + 1;
    this.destroyed = true;
    this.timeLeft = Math.floor(Math.random() * 5000);
  }
}

export function square(num: number) {
  return num * num;
}

export function distance(position1: Position, position2: Position): number {
  return Math.sqrt(square(position2.x - position1.x) + square(position2.y - position1.y));
}

export enum Color {
  Blue = 1,
  Green = 2,
  Yellow = 3,
}

export interface EdibleImpl {
  color: Color;
  position: Position;
  radius: number;
  onEat(eater: EdibleImpl, eaten: EdibleImpl): void;
}

export class Controller {
  controlled: (Controlled & GameObject)[] = [];
  update(dt: number) {
    for (const control of this.controlled) {

    }
  }
}

export class EdibleComponent {
  eaters: (EdibleImpl & GameObject)[] = [];
  edibles: (EdibleImpl & GameObject)[] = [];
  update(dt: number) {
    for (const edible of this.edibles) {
      if (edible.destroyed) {
        continue;
      }
      for (const eater of this.eaters) {
        if (distance(edible.position, eater.position) <= (edible.radius + eater.radius)) {
          eater.onEat(eater, edible);
          edible.onEat(eater, edible);
          console.log("collided", edible.id);
          console.log(eater.position, edible.position);
          break;
        }
      }
    }
  }
}

