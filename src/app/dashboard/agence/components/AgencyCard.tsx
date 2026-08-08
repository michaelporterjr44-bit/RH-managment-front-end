import { Agence } from "@/types/employee/employee";

interface AgencyCardProps {
  agency: Agence;
  onEdit: (agency: Agence) => void;
}

export default function AgencyCard({ agency, onEdit }: AgencyCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center">
            <i className="ri-building-line text-2xl text-white"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{agency.name}</h3>
            <span className="inline-block px-2 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-md">
              {agency.code}
            </span>
          </div>
        </div>
        <button
          onClick={() => onEdit(agency)}
          className="p-2 hover:bg-green-50 rounded-lg transition-colors duration-200 group"
        >
          <i className="ri-edit-line text-base text-gray-400 group-hover:text-green-600 transition-colors"></i>
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-2">
          <i className="ri-map-pin-line text-base text-gray-400 mt-0.5"></i>
          <p className="text-sm text-gray-600 leading-relaxed">{agency.address}</p>
        </div>

        <div className="flex items-center space-x-2">
          <i className="ri-phone-line text-base text-gray-400"></i>
          <p className="text-sm text-gray-600">{agency.contact}</p>
        </div>

        <div className="flex items-center space-x-2">
          <i className="ri-mail-line text-base text-gray-400"></i>
          <p className="text-sm text-gray-600 truncate">{agency.email}</p>
        </div>
      </div>
    </div>
  );
}
