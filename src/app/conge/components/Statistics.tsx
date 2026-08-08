"use client";

import { useEffect, useState } from "react";
import soldeCongeApi, { SoldeConge, PaginatedResponse } from "@/api/dashboard/leave/soldeConge";
import Pagination from "@/app/components/ui/Pagination";
import Toast from "@/app/components/ui/Toast";

const SoldeCongeTable = () => {
  const [soldes, setSoldes] = useState<SoldeConge[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState("");

  const [employeeToReset, setEmployeeToReset] = useState<SoldeConge | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetAllModalOpen, setIsResetAllModalOpen] = useState(false);
  const [isResetAllSoldeModalOpen, setIsResetAllSoldeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSuccess, setToastSuccess] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadSolde();
    }, 400);

    return () => clearTimeout(timer);

  }, [page, size, search]);

  const showToastMsg = (message: string, success = true) => {
    setToastMessage(message);
    setToastSuccess(success);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const loadSolde = async () => {
    setLoading(true);

    try {
      const data = await soldeCongeApi.getAll(
        page,
        size,
        search
      );

      setSoldes(
        data.content.filter(item => item.employee != null)
      );

      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);

    } catch (err) {
      console.error(err);
      showToastMsg("Erreur lors du chargement des soldes", false);
    } finally {
      setLoading(false);
    }
  };
  const confirmResetEmployee = (item: SoldeConge) => {
    setEmployeeToReset(item);
    setIsResetModalOpen(true);
  };

  const handleResetEmployee = async () => {
    if (!employeeToReset?.employee?.id) return;

    try {
      await soldeCongeApi.resetEmployee(employeeToReset.employee.id);
      await loadSolde();
      showToastMsg("Solde employé réinitialisé avec succès");
    } catch (error) {
      console.error("Erreur reset employé", error);
      showToastMsg("Erreur lors du reset de l'employé", false);
    }

    setIsResetModalOpen(false);
    setEmployeeToReset(null);
  };

  const confirmResetAllSolde = () => setIsResetAllModalOpen(true);
  const confirmResetAll = () => setIsResetAllSoldeModalOpen(true);

  const handleResetAll = async () => {
    try {
      await soldeCongeApi.resetAll();
      await loadSolde();
      showToastMsg("Tous les soldes réinitialisés avec succès");
    } catch (error) {
      console.error("Erreur reset all", error);
      showToastMsg("Erreur lors du reset de tous les employés", false);
    }

    setIsResetAllSoldeModalOpen(false);
  };

  const handleResetAllSolde = async () => {
    try {
      await soldeCongeApi.resetAllSolde();
      await loadSolde();
      showToastMsg("Tous les soldes réinitialisés avec succès");
    } catch (error) {
      console.error("Erreur reset all", error);
      showToastMsg("Erreur lors du reset de tous les employés", false);
    }

    setIsResetAllSoldeModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <div className="px-6 py-2 border-b border-slate-200 bg-green-800 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <i className="ri-user-fill text-white text-2xl"></i>
            <h1 className="text-base font-bold text-white">Solde de congé des employés</h1>
          </div>
          <button
            onClick={confirmResetAllSolde}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 text-xs rounded shadow"
          >
            Tout réinitialiser le solde
          </button>

          <button
            onClick={confirmResetAll}
            className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1.5 text-xs rounded shadow"
          >
            Réinitialiser le solde pour un nouvel employé
          </button>

          <div className="w-[50%]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="text-green-700"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="M21 21l-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                value={search}
                placeholder="Rechercher par nom ou matricule"
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="block w-full p-3 ps-9 border border-green-600 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 placeholder:text-green-700 bg-white text-green-800"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Chargement...</div>
        ) : soldes.length === 0 ? (
          <div className="p-6 text-center text-gray-500">Aucun solde trouvé</div>
        ) : (
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Matricule
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Solde restant
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {soldes.map((item) => {
                const employee = item.employee;
                if (!employee) return null;
                const imageUrl = employee.imageProfil?.url ?? `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}`;
                const lastName = employee.lastName ?? "N/A";
                const firstName = employee.firstName ?? "N/A";
                const matricule = employee.matricule ?? "N/A";

                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={imageUrl}
                          alt={lastName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                        />
                        <div>
                          <h1 className="text-sm font-semibold uppercase text-gray-800">{lastName}</h1>
                          <h1 className="text-xs text-gray-700">{firstName}</h1>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{matricule}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-700">{item.solde} jours</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => confirmResetEmployee(item)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <i className="ri-refresh-line"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        size={size}
        onPageChange={(p) => setPage(p)}
        onSizeChange={(s) => {
          setSize(s);
          setPage(0);
        }}
      />

      {/* Modales et Toast */}
      {isResetModalOpen && employeeToReset?.employee && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirmation</h2>
            <p className="text-gray-600 mb-6">
              Voulez-vous vraiment mettre à zéro le solde de{" "}
              <span className="font-semibold">
                {employeeToReset.employee.firstName} {employeeToReset.employee.lastName}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleResetEmployee}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {isResetAllModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirmation</h2>
            <p className="text-gray-600 mb-6">
              Voulez-vous vraiment mettre à zéro le solde de tous les employés ?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsResetAllModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleResetAllSolde}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {isResetAllSoldeModalOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirmation</h2>
            <p className="text-gray-600 mb-6">
              Confirmer l'ajout de nouvel solde pour le nouveau employé
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsResetAllSoldeModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleResetAll}
                className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-lg"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast message={toastMessage} success={toastSuccess} show={showToast} />
    </div>
  );
};

export default SoldeCongeTable;