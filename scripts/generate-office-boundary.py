"""Regenerate the suite mask from wall-face coordinates in the existing vector linework.

The PDF's pale suite highlight is approximate. These coordinates follow the actual inner
wall faces instead. Door openings close at their jambs, not around the door-swing arcs.
Run after regenerating common/office-plan.ts from the source PDF. No third-party modules.
"""
from pathlib import Path
import math
import re

TARGET = Path(__file__).resolve().parents[1] / 'common/office-plan.ts'

# Clockwise from the entrance's upper-left column, including the corner returns and sill steps.
POINTS = [
    (48, 6), (94, 6), (100, 5), (504, 5), (508, 6), (690, 6), (695, 6),
    (1427, 6), (1427, 22), (1437, 22), (1437, 350), (1429, 350),
    (1429, 356), (1272, 356), (1272, 307), (1053, 307), (1053, 404),
    (926, 404), (926, 475), (928, 475), (928, 490), (926, 490),
    (853, 490), (851, 490), (851, 485), (846, 485), (846, 525),
    (749, 525), (749, 490), (739, 490), (703, 490), (690, 490), (690, 525), (542, 525),
]
CURVES = [((542, 525), (532, 525), (521, 521), (514, 514)),
          ((514, 514), (507, 506), (502, 496), (502, 486))]
TAIL = [
    (502, 485), (444, 485), (444, 474), (427, 474), (427, 486), (356, 486),
    (356, 481), (355, 481), (350, 481), (348, 481), (348, 483),
    (192, 483), (192, 474), (187, 474), (187, 251), (10, 251), (10, 201),
    (15, 201), (15, 180), (17, 180), (17, 175), (14, 175), (14, 173),
    (16, 173), (16, 40), (48, 40), (48, 6),
]

def number(value):
    return f'{value:.6f}'.rstrip('0').rstrip('.') if value % 1 else str(int(value))

def pair(point):
    return ','.join(map(number, point))

def flatten(curve):
    # 64 segments per source cubic keep collision geometry within 0.005 in of the rendered curve.
    a, b, c, d = curve
    result = []
    for i in range(1, 65):
        t = i / 64
        result.append(tuple((1-t)**3*a[k] + 3*(1-t)**2*t*b[k] + 3*(1-t)*t*t*c[k] + t**3*d[k] for k in range(2)))
    return result

text = TARGET.read_text()
linework = re.search(r"export const LINES_PATH = '([^']*)';", text).group(1)
# Anchor the trace to the existing linework, so a regenerated drawing cannot silently drift.
segments = []
curves = []
current = (0, 0)
for command, arguments in re.findall(r'([Mhlvc])([^Mhlvc]*)', linework):
    values = list(map(float, re.findall(r'-?\d+(?:\.\d+)?', arguments)))
    if command == 'M':
        current = tuple(values)
        continue
    if command == 'h':
        end = (current[0] + values[0], current[1])
    elif command == 'v':
        end = (current[0], current[1] + values[0])
    else:
        points = [(current[0] + values[i], current[1] + values[i+1]) for i in range(0, len(values), 2)]
        end = points[-1]
        if command == 'c':
            curves.append((current, *points))
    if command != 'c':
        segments.append((current, end))
    current = end

def on_line(point, segment):
    a, b = segment
    length = math.dist(a, b)
    if length == 0:
        return math.dist(point, a) < 0.000001
    return abs(math.dist(a, point) + math.dist(point, b) - length) < 0.000001

for point in POINTS + TAIL:
    assert any(on_line(point, segment) for segment in segments), f'Anchor {point} no longer matches the linework.'
for curve in CURVES:
    assert curve in curves or tuple(reversed(curve)) in curves, f'Curve {curve} no longer matches the linework.'
path = 'M' + pair(POINTS[0]) + ''.join('L' + pair(p) for p in POINTS[1:])
polygon = list(POINTS)
for curve in CURVES:
    path += 'C' + ' '.join(pair(p) for p in curve[1:])
    polygon += flatten(curve)
path += ''.join('L' + pair(p) for p in TAIL) + 'Z'
polygon += TAIL
output = (
    '// Inner wall-face boundary. Regenerate with python3 scripts/generate-office-boundary.py.\n'
    '// The SVG retains the source curves; collision points approximate them within 0.005 in.\n'
    f"export const SUITE_PATH = '{path}';\n"
    f"export const SUITE_POINTS = '{' '.join(pair(p) for p in polygon)}';"
)
text, count = re.subn(r"// (?:Our suite's outline[^\n]*|Inner wall-face boundary[^\n]*)\n(?://[^\n]*\n)?(?:export const SUITE_PATH = '[^']*';\n)?export const SUITE_POINTS = '[^']*';", lambda _: output, text)
assert count == 1, 'Expected one generated boundary block.'
TARGET.write_text(text)
print(f'Regenerated wall-aligned mask: {len(polygon)} collision points and 2 exact SVG curves.')
