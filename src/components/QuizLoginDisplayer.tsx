type QuizRow = {
  [key: string]: string;
};

export default function QuizLoginDisplayer({
  credInfo,
}: {
  credInfo: QuizRow[];
}) {
  if (!credInfo || credInfo.length === 0) {
    return null; // nothing to show
  }

  return (
    <div className="mt-6 w-full overflow-x-auto">
      <h2 className="font-semibold text-gray-700 mb-2">Parsed CSV Preview:</h2>
      <table className="w-full border-collapse border border-gray-300 text-sm rounded-lg overflow-hidden">
        <thead className="bg-purple-200 text-purple-900">
          <tr>
            {Object.keys(credInfo[0]).map((header, idx) => (
              <th
                key={idx}
                className="border border-gray-300 px-3 py-2 text-left"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {credInfo.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {Object.values(row).map((value, colIndex) => (
                <td
                  key={colIndex}
                  className="border border-gray-300 px-3 py-2 break-words"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
