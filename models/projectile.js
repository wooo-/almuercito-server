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

  /**
  * Sets the initial data required to perform a parametric calculation
  * of the position and veocity in time for this projectile. It will
  * start moving when calling update().
  */
  launch(time, position, velocity, mass) {
    this.initialPosition = position;
    this.initialVelocity = velocity;
    this.initialTime = time;
    this.mass = mass;
    this.position = position;
    this.velocity = velocity;
    this.lastUpdate = time;
  }

  /**
  * Updates the state of this projectile. A ballistic trajectory is used
  * to calculate the velocity and position at the given game time.
  */
  update(world) {
    let t = world.time - this.initialTime;

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

    this.lastUpdate = world.time;
  }
};

module.exports = Projectile;
