export function NumberOverBarVerticalLabel(props: any) {
  const { x, y, width, value } = props;
  return (
    <text
      x={x + width / 2}
      y={y - 5}
      fill="var(--foreground)"
      textAnchor="middle"
      fontSize="12"
      fontWeight="500"
    >
      {value}
    </text>
  );
}

export function NumberOverBarHorizontalLabel(props: any) {
  const { x, y, width, height, value } = props;
  return (
    <text
      x={x + width + 25}
      y={y + height / 1.5}
      fill="var(--foreground)"
      textAnchor="middle"
      fontSize="12"
      fontWeight="500"
    >
      {value}
    </text>
  );
}
