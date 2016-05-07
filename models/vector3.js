/* jshint esversion: 6 */
(function() {
  'use strict';

  let Vector3 = class Vector3 {
    /**
    * Class constructor
    */
    constructor(x, y, z) {
      this._a = [
        x || 0.0,
        y || 0.0,
        z || 0.0
      ];
    }

    /**
    * Returns a new vector representing the addition
    * of this vector and a given one.
    */
    add(vector) {
      return new Vector3(
        this._a[0] + vector._a[0],
        this._a[1] + vector._a[1],
        this._a[2] + vector._a[2]
      );
    }

    /**
    * Returns a new vector representing the dot
    * product between this vector and a given one.
    */
    dot(vector) {
      return (
        this._a[0] * vector._a[0] +
        this._a[1] * vector._a[1] +
        this._a[2] * vector._a[2]
      );
    }

    /**
    * Returns a new vector representing the cross
    * product between this vector and a given one.
    */
    cross(vector) {
      return new Vector3(
        this._a[1] * vector._a[2] - this._a[2] * vector._a[1],
        this._a[2] * vector._a[0] - this._a[0] * vector._a[2],
        this._a[0] * vector._a[1] - this._a[1] * vector._a[0]
      );
    }

    /**
    * Returns a new vector with the same size
    * but in the opposite direction.
    */
    negate() {
      return new Vector3(
        -this._a[0], -this._a[1], -this._a[2]
      );
    }

    /**
    * Returns a new vector representing the subtraction
    * of a given vector from this one.
    */
    subtract(vector) {
      return new Vector3(
        this._a[0] - vector._a[0],
        this._a[1] - vector._a[1],
        this._a[2] - vector._a[2]
      );
    }

    /**
    * Returns a new vector representing the scalar
    * multiplication of this vector and a given number.
    */
    multiply(scalar) {
      return new Vector3(
        scalar * this._a[0],
        scalar * this._a[1],
        scalar * this._a[2]
      );
    }

    /**
    * Returns a new vector representing the scalar multiplication
    * of this vector and the inverse of a given number.
    */
    divide(scalar) {
      return new Vector3(
        this._a[0] / scalar,
        this._a[1] / scalar,
        this._a[2] / scalar
      );
    }

    /**
    * Returns a new vector that points in the same
    * direction (if possible) but with a length of 1.
    */
    normalize() {
      var length = Math.sqrt(
        this._a[0] * this._a[0] +
        this._a[1] * this._a[1] +
        this._a[2] * this._a[2]
      );

      if (length === 0) {
        return new Vector3(0, 0, 0);
      }

      return new Vector3(
        this._a[0] / length, this._a[1] / length, this._a[2] / length
      );
    }

    /**
    * Returns the length of this vector.
    */
    length() {
      return Math.sqrt(
        this._a[0] * this._a[0] +
        this._a[1] * this._a[1] +
        this._a[2] * this._a[2]
      );
    }

    /**
    * Returns the squared length of this vector, performs
    * better than .length() that is not always necessary.
    */
    lengthSquared() {
      return (
        this._a[0] * this._a[0] +
        this._a[1] * this._a[1] +
        this._a[2] * this._a[2]
      );
    }

    /**
    * Return a string representation of this vector.
    */
    toString() {
      return '(' + this._a[0] + ', ' + this._a[1] + ', ' + this._a[2] + ')';
    }
  };

  /**********************************
   * Vector3 properties definitions *
   *********************************/

  var prop0 = {
    enumerable: true,

    get: function() { return this._a[0]; },

    set: function(val) { this._a[0] = val; }
  };

  var prop1 = {
    enumerable: true,

    get: function() { return this._a[1]; },

    set: function(val) { this._a[1] = val; }
  };

  var prop2 = {
    enumerable: true,

    get: function() { return this._a[2]; },

    set: function(val) { this._a[2] = val; }
  };

  // Define x, y and z properties. Define [0], [1], [2] too
  Object.defineProperties(Vector3.prototype, {
    x: prop0,
    y: prop1,
    z: prop2,
    0: prop0,
    1: prop1,
    2: prop2
  });

  // Export vector class
  module.exports = Vector3;
})();
