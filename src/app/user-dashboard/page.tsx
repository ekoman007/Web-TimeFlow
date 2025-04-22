"use client";

export default function UserDashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Mirësevini në Business Dashboard!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Këtu mund të menaxhoni oraret, klientët dhe stafin tuaj në mënyrë të lehtë dhe efikase.
      </p>
      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition">
          Shiko Terminet
        </button>
        <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition">
          Shto Klient të Ri
        </button>
      </div>
    </div>
  );
}
