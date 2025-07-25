export default function ColorPicker({
  colors,
  selected,
  onSelect,
}: {
  colors: { name: string; value: string }[];
  selected: string;
  onSelect: (color: string) => void;
}) {
  return (
    <div className="flex gap-6 justify-center mt-6">
      {colors.map((color) => (
        <button
          key={color.value}
          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
            selected === color.value
              ? "border-white scale-110"
              : "border-transparent"
          } focus:outline-none`}
          style={{ background: color.value }}
          aria-label={color.name}
          onClick={() => onSelect(color.value)}
        />
      ))}
    </div>
  );
}
