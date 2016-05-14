/* jshint esversion: 6 */
const GameObject = require('./game_object');
const Vector3 = require('./vector3');

let Projectile = class Projectile extends GameObject {
  /**
  * Class constructor.
  */
  constructor() {
    this.initialPosition = new Vector3();
    this.initialVelocity = new Vector3();
    this.initialTime = new Vector3();
    this.mass = 0.0;
    super(); // position, velocity, lastUpdate
  }

  launch(gameTime, position, velocity, mass) {
    this.initialPosition = position;
    this.initialVelocity = velocity;
    this.initialTime = gameTime;
    this.mass = mass;
    this.position = position;
    this.velocity = velocity;
    this.lastUpdate = gameTime;
  }

  /**
  * Updates the state of this projectile. A ballistic trajectory is used
  * to calculate the velocity and position at the given game time.
  */
  update(gameTime, world) {
    let t = gameTime - this.initialTime;

    // v = v0 + a*t
    this.velocity = this.initialVelocity.add(
      world.gravity.multiply(t)
    );

    // p = p0 + v0*t + (a*t^2)/2
    this.position = this.initialPosition.add(
      this.initialVelocity.multiply(t)
    ).add(
      this.world.gravity.multiply(t * t / 2)
    );

    this.lastUpdate = gameTime;
  }
};

module.exports = Projectile;
