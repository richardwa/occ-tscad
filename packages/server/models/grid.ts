import { box, sphere, circle, Vec2 } from "occ-tscad";

type GridProps = {
  thickness: number;
  border: number;
  rows: number;
  cols: number;
  keySize: Vec2;
  gap: Vec2;
};

export const grid = ({
  thickness,
  border,
  rows,
  cols,
  keySize,
  gap,
}: GridProps) => {
  const totalKeySize = [keySize[0] + gap[0], keySize[1] + gap[1]];
  return box(
    2 * border + cols * totalKeySize[0] - gap[0],
    2 * border + rows * totalKeySize[1] - gap[1],
    thickness,
    false,
  ).cut(
    box(keySize[0], keySize[1], thickness * 2, false)
      .translate([border, border, -thickness])
      .repeat(cols, [totalKeySize[0], 0, 0])
      .repeat(rows, [0, totalKeySize[1], 0]),
  );
};

export const main = () =>
  grid({
    thickness: 2,
    border: 10,
    rows: 4,
    cols: 8,
    keySize: [19, 19],
    gap: [5, 5],
  });
