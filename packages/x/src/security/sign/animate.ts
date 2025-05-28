/* eslint-disable @typescript-eslint/no-non-null-assertion -- assert indexed access */

/**
 * Computes the interpolated value at a given normalized time using the cubic Bezier curve.
 *
 * For time values within [0, 1], this method uses a binary search to find the parameter
 * value on the curve that corresponds to the given time, then evaluates the curve at that point.
 * For time values outside [0, 1], the curve is linearly extrapolated using the tangent at the
 * respective endpoint.
 *
 * @param curves - The control points for the curve, as [x1, y1, x2, y2].
 * @param time - Normalized time value (typically between 0.0 and 1.0).
 * @param epsilon - Precision of the computation (default is 1e-6).
 * @returns The interpolated value at the specified time.
 */
function cubicBezierValue(curves: [number, number, number, number], time: number, epsilon = 1e-6): number {
  function calculate(a: number, b: number, m: number): number {
    return 3.0 * a * (1 - m) * (1 - m) * m + 3.0 * b * (1 - m) * m * m + m * m * m;
  }

  function handleLowerBound(t: number): number {
    let startGradient = 0;
    if (curves[0] > 0.0) {
      startGradient = curves[1] / curves[0];
    } else if (curves[1] === 0.0 && curves[2] > 0.0) {
      startGradient = curves[3] / curves[2];
    }
    return startGradient * t;
  }

  function handleUpperBound(t: number): number {
    let endGradient = 0;
    if (curves[2] < 1.0) {
      endGradient = (curves[3] - 1.0) / (curves[2] - 1.0);
    } else if (curves[2] === 1.0 && curves[0] < 1.0) {
      endGradient = (curves[1] - 1.0) / (curves[0] - 1.0);
    }
    return 1.0 + endGradient * (t - 1.0);
  }

  let start = 0.0;
  let mid = 0.0;
  let end = 1.0;

  if (time <= 0.0) return handleLowerBound(time);
  if (time >= 1.0) return handleUpperBound(time);

  while (start < end) {
    mid = (start + end) / 2;
    const xEst = calculate(curves[0], curves[2], mid);
    if (Math.abs(time - xEst) < epsilon) {
      return calculate(curves[1], curves[3], mid);
    }
    if (xEst < time) {
      start = mid;
    } else {
      end = mid;
    }
  }
  return calculate(curves[1], curves[3], mid);
}

/**
 * Interpolates between two arrays of numbers element-wise.
 *
 * Each element in the resulting array is computed by interpolating between the corresponding
 * elements of the input arrays using the provided interpolation factor.
 *
 * @param fromList - The starting array of numbers.
 * @param toList - The ending array of numbers.
 * @param f - Interpolation factor (0.0 returns fromList, 1.0 returns toList, values in between blend).
 * @returns An array of interpolated values.
 * @throws Error if the input arrays have different lengths.
 */
function interpolate(fromList: number[], toList: number[], f: number): number[] {
  if (fromList.length !== toList.length) {
    throw new Error('Input arrays must have the same length');
  }
  return fromList.map((fromVal, i) => interpolateNum(fromVal, toList[i]!, f));
}

/**
 * Interpolates between two values, which can be either numbers or booleans.
 *
 * - For numbers, performs linear interpolation: (1-f) * fromVal + f * toVal.
 * - For booleans, returns the value of fromVal if f \< 0.5, otherwise returns toVal.
 *   The result is always returned as a number: 1 for true, 0 for false.
 *
 * @param fromVal - The starting value (number or boolean).
 * @param toVal - The ending value (number or boolean).
 * @param f - Interpolation factor (0.0 returns fromVal, 1.0 returns toVal).
 * @returns The interpolated value as a number.
 */
function interpolateNum(fromVal: number | boolean, toVal: number | boolean, f: number): number {
  if (typeof fromVal === 'number' && typeof toVal === 'number') {
    return fromVal * (1 - f) + toVal * f;
  }

  if (typeof fromVal === 'boolean' && typeof toVal === 'boolean') {
    if (f < 0.5) {
      return fromVal ? 1 : 0;
    }
    return toVal ? 1 : 0;
  }

  return 0;
}

/**
 * Converts a rotation angle in degrees to a 2D transformation matrix.
 *
 * The resulting matrix is represented as a flat array of 4 values [a, b, c, d],
 * corresponding to the following 2x2 matrix:
 *
 *   [ a  c ]
 *   [ b  d ]
 *
 * where:
 *   a = cos(theta)
 *   b = sin(theta)
 *   c = -sin(theta)
 *   d = cos(theta)
 *
 * @param degrees - Rotation angle in degrees.
 * @returns Array of 4 numbers representing the 2x2 rotation matrix.
 */
function convertRotationToMatrix(degrees: number): number[] {
  // Convert degrees to radians
  const radians = (degrees * Math.PI) / 180;

  // Compute matrix components
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [cos, sin, -sin, cos];
}

/**
 * Represents a single keyframe in an animation sequence.
 */
interface Keyframe {
  /**
   * Color values at the start and end of the keyframe.
   * Each color is represented as an array of three numbers (R, G, B).
   */
  color: [[number, number, number], [number, number, number]];
  /**
   * Transformation values for the keyframe.
   * Currently only supports rotation represented as an array of two numbers.
   */
  transform: {
    rotate: [number, number];
  };
  /**
   * Easing function for the keyframe.
   * Currently only supports cubic Bezier easing represented as an array of four numbers.
   */
  easing: {
    cubicBezier: [number, number, number, number];
  };
}

/**
 * Interpolates color and rotation values from frame data at a given normalized time.
 *
 * @param keyframe - Array of frame values extracted from SVG path data.
 * @param duration -
 * @returns Computed color and transform values as hexadecimal strings.
 * @throws Error if frame data is invalid or if the number of frames is insufficient.
 */
function animate(keyframe: Keyframe, duration: number): { color: string; transform: string } {
  // Create a cubic Bezier interpolator and compute the interpolation value.
  const val = cubicBezierValue(keyframe.easing.cubicBezier, duration);

  // Interpolate color and rotation values.
  const color = interpolate(keyframe.color[0], keyframe.color[1], val).map((value) => (value > 0 ? value : 0));
  const rotation = interpolateNum(keyframe.transform.rotate[0], keyframe.transform.rotate[1], val);
  const matrix = convertRotationToMatrix(rotation);

  // Convert color and matrix values to a hexadecimal string representation.
  const colorHex = color.map((value) => Math.round(value).toString(16));
  const transformHex = matrix.map((value) => {
    let rounded = Math.round(value * 100) / 100;
    if (rounded < 0) {
      rounded = -rounded;
    }
    return rounded.toString(16).toLowerCase();
  });

  return {
    color: colorHex.join(''),
    transform: transformHex.concat('0', '0').join(), // Append padding
  };
}

export { animate };
export type { Keyframe };
