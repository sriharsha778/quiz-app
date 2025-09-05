type QuestionRow = {
  [key: string]: any; // dynamic keys based on JSON fields
};

export default function QuestionDisplayer({
  questions,
}: {
  questions: QuestionRow[];
}) {
  if (!questions || questions.length === 0) return null;

  const headers = Array.from(new Set(questions.flatMap((q) => Object.keys(q)))); // Get all unique keys across questions

  return (
    <div className="mt-6 w-full overflow-x-auto">
      <h2 className="font-semibold text-gray-700 mb-2">Questions Preview:</h2>
      <table className="w-full border-collapse border border-gray-300 text-sm rounded-lg overflow-hidden">
        <thead className="bg-purple-200 text-purple-900">
          <tr>
            {headers.map((header, idx) => (
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
          {questions.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
            >
              {headers.map((header, colIndex) => (
                <td
                  key={colIndex}
                  className="border border-gray-300 px-3 py-2 break-words"
                >
                  {row[header] !== undefined ? row[header] : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
