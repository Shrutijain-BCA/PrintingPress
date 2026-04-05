export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-96 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        <input
          placeholder="Roll No / Shop ID"
          className="w-full border p-2 rounded mb-3"
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </div>
    </div>
  );
}
