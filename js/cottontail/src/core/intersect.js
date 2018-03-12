// Copyright 2018 The Immersive Web Community Group
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

export class Ray {
  constructor(matrix = null) {
    this.origin = vec3.create();

    this._dir = vec3.create();
    this._dir[2] = -1.0;

    if (transform) {
      mat4.transformVec3(this.origin, this.origin, matrix);
      mat4.transformVec3(this._dir, this._dir, matrix);
      mat4.sub(this._dir, this._dir, this.origin);
    }

    this.inv_dir = vec3.fromValues(
      1.0 / this._dir[0],
      1.0 / this._dir[1],
      1.0 / this._dir[2]);

    this.sign = [
      (this.inv_dir[0] < 0) ? 1 : -1,
      (this.inv_dir[1] < 0) ? 1 : -1,
      (this.inv_dir[2] < 0) ? 1 : -1
    ];
  }

  get dir() {
    return this._dir;
  }

  set dir(value) {
    this._dir = vec3.copy(this._dir, value);

    this.inv_dir = vec3.fromValues(
      1.0 / this._dir[0],
      1.0 / this._dir[1],
      1.0 / this._dir[2]);

    this.sign = [
      (this.inv_dir[0] < 0) ? 1 : -1,
      (this.inv_dir[1] < 0) ? 1 : -1,
      (this.inv_dir[2] < 0) ? 1 : -1
    ];
  }
}

export class AABB {
  constructor() {
    this.min = vec3.create();
    this.max = vec3.create();
  }

  // Borrowed from:
  // https://www.scratchapixel.com/lessons/3d-basic-rendering/minimal-ray-tracer-rendering-simple-shapes/ray-box-intersection
  rayIntersect(r) {
    let bounds = [this.min, this.max];

    let tmin = (bounds[r.sign[0]][0] - r.origin[0]) * r.inv_dir[0];
    let tmax = (bounds[1-r.sign[0]][0] - r.origin[0]) * r.inv_dir[0];
    let tymin = (bounds[r.sign[1]][1] - r.origin[1]) * r.inv_dir[1];
    let tymax = (bounds[1-r.sign[1]][1] - r.origin[1]) * r.inv_dir[1];

    if ((tmin > tymax) || (tymin > tmax))
        return -1;
    if (tymin > tmin)
        tmin = tymin;
    if (tymax < tmax)
        tmax = tymax;

    let tzmin = (bounds[r.sign[2]][2] - r.origin[2]) * r.inv_dir[2];
    let tzmax = (bounds[1-r.sign[2]][2] - r.origin[2]) * r.inv_dir[2];

    if ((tmin > tzmax) || (tzmin > tmax)) 
        return -1; 
    if (tzmin > tmin) 
        tmin = tzmin; 
    if (tzmax < tmax) 
        tmax = tzmax; 
 
    return 1; 
  }
}
