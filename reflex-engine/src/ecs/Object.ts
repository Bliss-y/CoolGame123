export type Position = {
  x: number,
  y: number
}

export abstract class GameObject {
  static OBJECT_ID = 0;
  id: number;
  color: Color;
  position: Position;
  radius: number;
  destroyed = false;
  constructor(position: Position, radius: number, color: Color) {
    this.id = GameObject.OBJECT_ID++;
    this.position = position;
    this.radius = radius;
    this.color = color;
  }
  update(dt: number): void {
    return;
  }
}

export interface Controlled {
  input: Position;
}

export class Circles extends GameObject implements EdibleImpl, Controlled, Collidables {
  movement_speed_mult = 15;
  static RULES = [2, 3, 1];
  movingDirection = { x: 0, y: 0 };
  input: Position = { x: 0, y: 0 };
  movingSpeed = { x: 0, y: 0 };
  health = 50;
  private static MAX_HEALTH = 100;
  collisionDirection = { x: 0, y: 0 };
  constructor(position: Position, radius: number) {
    super(position, radius, Math.floor(Math.random() * 3) + 1);
  }
  onCollision(collisionWith: Collidables, collisionDirection: Position): void {
    if (collisionWith instanceof Circles) {
      if (this.color == Circles.RULES[collisionWith.color - 1]) {
        this.health = Math.max(this.health - 10, 0);
        this.radius = Math.max(this.radius - 10, 0);
      } else if (collisionWith.color == Circles.RULES[this.color - 1]) {
        this.health = Math.min(this.health + 10, 100);
        this.radius = Math.min(this.radius + 10, 100);
      }
      this.position = {
        x: this.position.x + (this.collisionDirection.x / (Math.abs(this.collisionDirection.x) + 1)) * this.movement_speed_mult * 100,
        y: this.position.y + (this.collisionDirection.y / (Math.abs(this.collisionDirection.y) + 1)) * this.movement_speed_mult * 100
      }
    }
    this.collisionDirection = collisionDirection;
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
    /*
    if (this.movingSpeed.x > 0 && this.collisionDirection.x > 0 || this.movingSpeed.x < 0 && this.collisionDirection.x < 0) {
      this.movingSpeed.x = 0;
    }
    if (this.movingSpeed.y > 0 && this.collisionDirection.y > 0 || this.movingSpeed.y < 0 && this.collisionDirection.y < 0) {
      this.movingSpeed.y = 0;
    }
    */
    this.position.x = this.position.x + this.movingSpeed.x;
    if (this.position.x + this.radius > 1000) {
      this.position.x = 1000 - this.radius;
    }
    if (this.position.x - this.radius < 0) {
      this.position.x = 0 + this.radius;
    }
    this.position.y = this.position.y + this.movingSpeed.y;
    if (this.position.y - this.radius < 0) {
      this.position.y = 0 + this.radius;
    }
    if (this.position.y + this.radius > 1000) {
      this.position.y = 1000 - this.radius;
    }
    this.collisionDirection = { x: 0, y: 0 }
  }

  onEat(eater: EdibleImpl, eaten: EdibleImpl): void {
    this.color = eaten.color;
    this.health = Math.min(this.health + 10, 100);
    this.radius = Math.min(this.radius + 10, 100);
  }
}

export interface Collidables {
  position: Position;
  radius: number;
  onCollision(collisionWith: Collidables, collisionDirection: Position): void;
}

export class Collision {
  colliders: (Collidables & GameObject)[] = [];
  update() {
    for (let i = 0; i < this.colliders.length - 1; i++) {
      const collider1 = this.colliders[i];
      if (collider1.destroyed) {
        continue;
      }
      for (let j = i + 1; j < this.colliders.length; j++) {
        const collider2 = this.colliders[j];
        if (collider2.destroyed) {
          continue;
        }
        if (distance(collider1.position, collider2.position) <= square(collider2.radius + collider1.radius)) {
          const dx = collider2.position.x - collider1.position.x;
          const dy = collider2.position.y - collider1.position.y;
          collider1.onCollision(collider2, { x: dx, y: dy });
          collider2.onCollision(collider1, { x: -dx, y: -dy });
          console.log("collision!", JSON.stringify([collider1, collider2, dx, dy], null, 2));
        }
      }
    }
  }
}

export class Food extends GameObject implements EdibleImpl {
  timeLeft = 0;
  constructor(position: Position, radius: number) {
    super(position, radius, Math.floor(Math.random() * 3) + 1);
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
  return square(position2.x - position1.x) + square(position2.y - position1.y);
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
        if (eater.destroyed) {
          continue;
        }
        if (distance(edible.position, eater.position) <= square(edible.radius + eater.radius)) {
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

