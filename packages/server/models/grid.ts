import { box, sphere, circle, Vec2 } from "occ-tscad";

type GridProps = {
  thickness: number;
  border: Vec2;
  rowsCols: Vec2;
  keySize: Vec2;
  gap: Vec2;
};

export const grid = ({
  thickness,
  border,
  rowsCols,
  keySize,
  gap,
}: GridProps) => {
  const totalKeySize = [keySize[0] + gap[0], keySize[1] + gap[1]];
  return box(
    2 * border[0] + rowsCols[1] * totalKeySize[0] - gap[0],
    2 * border[1] + rowsCols[0] * totalKeySize[1] - gap[1],
    thickness,
    false,
  ).cut(
    box(keySize[0], keySize[1], thickness * 2, false)
      .translate([border[0], border[1], -thickness])
      .repeat(rowsCols[1], [totalKeySize[0], 0, 0])
      .repeat(rowsCols[0], [0, totalKeySize[1], 0]),
  );
};

export const main = () =>
  grid({
    thickness: 2,
    border: [10,2],
    rowsCols: [4, 8],
    keySize: [25, 19],
    gap: [10, 5],
  });
