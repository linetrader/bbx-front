import React from "react";

interface RegisterViewProps {
  formData: {
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    password: string;
    confirmPassword: string;
    referrer: string;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      email: string;
      username: string;
      firstname: string;
      lastname: string;
      password: string;
      confirmPassword: string;
      referrer: string;
    }>
  >;
  error: string;
  requiredFields: string[];
  handleRegister: () => void;
}

const RegisterView: React.FC<RegisterViewProps> = ({
  formData,
  setFormData,
  error,
  requiredFields,
  handleRegister,
}) => {
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
          Register
        </h1>
        {error && (
          <div className="bg-red-100 text-red-700 border border-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => handleChange("username", e.target.value)}
          className={`w-full px-4 py-2 mb-4 border rounded focus:outline-none text-black ${
            requiredFields.includes("username")
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-indigo-500"
          }`}
        />
        {requiredFields.includes("username") && (
          <p className="text-red-500 text-sm mb-4">This field is required.</p>
        )}
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstname}
          onChange={(e) => handleChange("firstname", e.target.value)}
          className={`w-full px-4 py-2 mb-4 border rounded focus:outline-none text-black ${
            requiredFields.includes("firstname")
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-indigo-500"
          }`}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastname}
          onChange={(e) => handleChange("lastname", e.target.value)}
          className={`w-full px-4 py-2 mb-4 border rounded focus:outline-none text-black ${
            requiredFields.includes("lastname")
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-indigo-500"
          }`}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={`w-full px-4 py-2 mb-4 border rounded focus:outline-none text-black ${
            requiredFields.includes("email")
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-indigo-500"
          }`}
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          className={`w-full px-4 py-2 mb-4 border rounded focus:outline-none text-black ${
            requiredFields.includes("password")
              ? "border-red-500 focus:ring-red-500"
              : "focus:ring-indigo-500"
          }`}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none text-black focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="Referrer (Optional)"
          value={formData.referrer}
          onChange={(e) => handleChange("referrer", e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none text-black focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleRegister}
          className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-400"
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default RegisterView;
