export default function RequestPrintPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 flex justify-center">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Request Print
          </h1>
          <p className="text-slate-500 mt-1">
            Upload your file and choose print options
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Upload PDF
            </label>
            <input
              type="file"
              accept=".pdf"
              className="block w-full text-sm text-slate-600
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0
                         file:bg-slate-100 file:text-slate-700
                         hover:file:bg-slate-200"
            />
          </div>

          {/* Pages */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                From Page
              </label>
              <input
                type="number"
                placeholder="1"
                className="w-full border border-slate-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                To Page
              </label>
              <input
                type="number"
                placeholder="10"
                className="w-full border border-slate-300 rounded-md p-2"
              />
            </div>
          </div>

          {/* Copies */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Number of Copies
            </label>
            <input
              type="number"
              placeholder="1"
              className="w-full border border-slate-300 rounded-md p-2"
            />
          </div>

          {/* Print Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Print Type
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="radio" name="printType" defaultChecked />
                Black & White
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="radio" name="printType" />
                Color
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            className="w-full bg-blue-600 text-white py-2.5 rounded-md
                       hover:bg-blue-700 transition"
          >
            Submit Print Request
          </button>
        </div>
      </div>
    </div>
  );
}
