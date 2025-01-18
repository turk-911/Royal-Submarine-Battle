import { SubmarineSelectionProps } from "../utils/types";
export default function SubmarineSelection({
  submarines,
  onSelect,
  selectedSubmarine,
}: SubmarineSelectionProps) {
  return (
    <>
      <div className="flex space-x-2 m-4 items-center justify-center">
        {submarines.map(({ id, name, length, count }) => (
          <button
            key={id}
            className={`px-4 py-2 rounded ${
              selectedSubmarine?.id === id
                ? "bg-blue-500 text-white"
                : "bg-blue-300"
            }`}
            onClick={() => onSelect({ id, name, length, hits: 0 })}
            disabled={count === 0}
          >
            {`${name} (Remaining: ${count})`}
          </button>
        ))}
      </div>
    </>
  );
}
