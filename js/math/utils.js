import { Point } from "../primitives/point.js";

export function distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export function getNearestPoint(loc, points, threshold = Infinity) {
    let nearestPoint = null;
    let nearestDistance = Infinity;

    points.forEach((p) => {
        const dist = distance(loc, p);
        if (dist < nearestDistance && dist < threshold) {
            nearestDistance = dist;
            nearestPoint = p;
        }
    });
    return nearestPoint;
}

//? Calcular la distancia perpendicular al segmento entero
export function perpendicularDistance(loc, s) {
    const x1 = s.p1.x;
    const y1 = s.p1.y;
    const x2 = s.p2.x;
    const y2 = s.p2.y;

    const numerator = Math.abs((y2 - y1) * loc.x - (x2 - x1) * loc.y + x2 * y1 - y2 * x1);
    const denominator = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));

    return numerator / denominator;
}

export function getNearestToAllSegment(loc, segments, threshold = Infinity) {
    let nearestSegment = null;
    let nearestDistance = Infinity;

    segments.forEach((s) => {
        const dist = perpendicularDistance(loc, s);
        if (dist < nearestDistance && dist < threshold) {
            nearestDistance = dist;
            nearestSegment = s;
        }
    })

    return nearestSegment
}

//? Calcular la distancia al centro del segmento?
export function getNearestSegmentWithCenterPoint(loc, segments, threshold = Infinity) {
    let nearestSegment = null;
    let nearestDistance = Infinity;

    segments.forEach((segment) => {
        const centerX = (segment.p1.x + segment.p2.x) / 2;
        const centerY = (segment.p1.y + segment.p2.y) / 2;
        const centerPoint = new Point(centerX, centerY);
        const dist = distance(loc, centerPoint);
        if (dist < nearestDistance && dist < threshold) {
            nearestDistance = dist;
            nearestSegment = segment;
        }
    });

    return nearestSegment;
}

export function getNearestSegment(loc, segments, threshold = Infinity) {
    let nearestSegment = null;
    let nearestDistance = Infinity;
    for(const seg of segments) {
        const dist = seg.distanceToPoint(loc)
        if (dist < nearestDistance && dist < threshold) {
            nearestDistance = dist;
            nearestSegment = seg;
        }
    }
    return nearestSegment
}


export function average(p1, p2) {
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}


export function dot(p1, p2) {
    return p1.x * p2.x + p1.y * p2.y
}

export function subtract(p1, p2) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}

export function add(p1, p2) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}

export function scale(vp, factor) {
    return new Point(vp.x * factor, vp.y * factor);
}

export function normalize(p) {
    return scale(p, 1 / magnitude(p));
}

export function magnitude(p) {
    return Math.hypot(p.x, p.y);
}

export function translate(loc, angle, offset) {
    return new Point(
        loc.x + Math.cos(angle) * offset,
        loc.y + Math.sin(angle) * offset
    )
}

export function angle(p) {
    return Math.atan2(p.y, p.x);
}

export function getIntersection(A, B, C, D) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    const eps = 0.000001;
    if (Math.abs(bottom) > eps) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            }
        }
    }
}

export function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

export function lerp2D(a, b, t) {
    return new Point(lerp(a.x, b.x, t), lerp(a.y, b.y, t));
}


export function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return `hsl(${hue}, 100%, 60%)`;
}

export function getFake3dPoint(point, viewPoint, height) {
    const dir = normalize(subtract(point, viewPoint));
    const dist = distance(point, viewPoint);
    const scaler = Math.atan(dist / 300) / (Math.PI / 2);
    return add(point, scale(dir, height * scaler));
}
