import React, { useState, useEffect } from "react";
import { Agence } from "@/types/employee/employee";
import { AgencyFormData } from "@/types/agency/agency";

interface AgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: AgencyFormData) => void;
  agency: Agence | null;
  loading?: boolean;
}

export default function AgencyModal({ isOpen, onClose, onSubmit, agency, loading = false }: AgencyModalProps) {
  const [formData, setFormData] = useState<AgencyFormData>({
    code: "",
    name: "",
    address: "",
    contact: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<AgencyFormData>>({});

  useEffect(() => {
    if (agency) {
      setFormData({
        code: agency.code,
        name: agency.name,
        address: agency.address,
        contact: agency.contact,
        email: agency.email,
      });
    } else {
      setFormData({ code: "", name: "", address: "", contact: "", email: "" });
    }
    setErrors({});
  }, [agency, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation simple
    const newErrors: Partial<AgencyFormData> = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) newErrors[key as keyof AgencyFormData] = "Required";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{agency ? "Update Agency" : "Create Agency"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <i className="ri-close-line text-gray-500"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          {["code", "name", "address", "contact", "email"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1">
                {field.charAt(0).toUpperCase() + field.slice(1)} <span className="text-red-500">*</span>
              </label>
              {field === "address" ? (
                <textarea
                  id={field}
                  name={field}
                  rows={3}
                  value={formData[field as keyof AgencyFormData]}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors[field as keyof AgencyFormData] ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-lg focus:outline-none focus:ring-2 transition-all resize-none`}
                  placeholder={`Enter ${field}`}
                />
              ) : (
                <input
                  type={field === "email" ? "email" : "text"}
                  id={field}
                  name={field}
                  value={formData[field as keyof AgencyFormData]}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border ${errors[field as keyof AgencyFormData] ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'} rounded-lg focus:outline-none focus:ring-2 transition-all`}
                  placeholder={`Enter ${field}`}
                />
              )}
              {errors[field as keyof AgencyFormData] && <p className="mt-1 text-sm text-red-600">{errors[field as keyof AgencyFormData]}</p>}
            </div>
          ))}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && <i className="ri-loader-4-line animate-spin"></i>}
              <span>{agency ? "Update Agency" : "Create Agency"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}