// @ts-nocheck
import Color, {CoordMeta, type Coords} from "colorjs.io";

export function useContrastLines(color: Ref<Color>) {
    const hueStep = 0.1;
    const lightnessStep = 0.1;
    const chromaStep = 0.1;

    function calculateHueLines() {
        const lines = [];
        for (let h = 0; h < 1; h += hueStep) {
            const points: number[][] = [];
            // Calculate points along the boundary
            for (let s = 0; s <= 1; s += chromaStep) {
                for (let l = 0; l <= 1; l += lightnessStep) {
                    const color = new Color("hsl",[h, s, l]);
                    const srgbColor = color.to("srgb");
                    if (srgbColor.inGamut() && !pointsContainSimilar(points, [s, l])) {
                        points.push([s, l]);
                    }
                }
            }
            // Find the boundary points
            const boundaryPoints = findBoundaryPoints(points);
            if (boundaryPoints.length > 2) {
                lines.push({
                    hue: h,
                    points: boundaryPoints
                });
            }
        }
        return lines;
    }


    function pointsContainSimilar(points: number[][], point: number[]) {
        const tolerance = 0.01;
        return points.some(p => Math.abs(p[0] - point[0]) < tolerance && Math.abs(p[1] - point[1]) < tolerance);
    }

    function findBoundaryPoints(points: number[][]) {
        const boundaryPoints = [];
        for (let i = 0; i < points.length; i++) {
            const p1 = points[i];
            const p2 = points[(i + 1) % points.length];
            if (isBoundaryPoint(p1, p2)) {
                boundaryPoints.push(p1);
            }
        }
        return boundaryPoints;
    }

    function isBoundaryPoint(p1: number[], p2: number[]) {
        const tolerance = 0.01;
        return Math.abs(p1[0] - p2[0]) > tolerance || Math.abs(p1[1] - p2[1]) > tolerance;
    }

    const hueLines = computed(() => calculateHueLines());

    return {hueLines,calculateHueLines};

}