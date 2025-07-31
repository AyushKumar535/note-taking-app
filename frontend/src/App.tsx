import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Note Taking App
          </h1>
          <p className="text-gray-600">Testing Tailwind CSS Configuration</p>
        </div>

        {/* Test Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tailwind Test
          </h2>

          {/* Primary Button Test */}
          <button
            onClick={() => setCount((count) => count + 1)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
            style={{ backgroundColor: "#337DFF" }}
          >
            Count is {count}
          </button>

          {/* Test various Tailwind classes */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Flexbox:</span>
              <span className="text-sm font-medium text-gray-900">
                ✓ Working
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Colors:</span>
              <div className="flex space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Typography:</span>
              <span className="text-sm font-semibold text-gray-900">
                ✓ Working
              </span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center">
          <p className="text-green-600 font-medium">
            🎉 Tailwind CSS is configured and working!
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
