/**
 * line equation form:
 * y = mx + b
 * m is slope
 * b is y-intercept
 */
namespace("2181robotics.beach-bash.GridMath", () => {
  const pythagorean = (a,b) => Math.sqrt(a * a + b * b);
  const distance = (x1,y1,x2,y2) => pythagorean(Math.abs(x2-x1),Math.abs(y2-y1));
  const slope = (x1,y1,x2,y2) => (y2 - y1)/(x2 - x1);
  const yIntercept = (x, y, slope) => y - slope * x;
  const line2coeff = (x1,y1,x2,y2) => {
    const m = slope(x1,y1,x2,y2);
    const b = yIntercept(x1,y1,m);
    return { m, b };
  };
  const lineCoeffIntersection = ({ m: m1, b: b1 }, { m: m2, b: b2 }) => {
    const x = (b1 - b2) / (m2 - m1)
  };
  const perpendicularSlope = (slope) => -1/slope;
  const deg2rad = (degrees) => degrees * Math.PI / 180;
  const rad2deg = (radians) => radians * 180 / Math.PI;
  
  return { 
    pythagorean, distance, slope, yIntercept, line2coeff, lineCoeffIntersection, perpendicularSlope, deg2rad, rad2deg 
  };
});