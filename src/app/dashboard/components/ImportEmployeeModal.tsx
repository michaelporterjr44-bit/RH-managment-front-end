'use client';

import { useState, useRef } from "react";
import { importEmployees } from "@/api/dashboard/employee/importEmployee";
import Toast from "@/app/components/ui/Toast"; // Ajuste le chemin selon ta structure
import { 
  FileSpreadsheet, 
  FileText, 
  FileUp, 
  Loader2, 
  X,
  CheckCircle2
} from "lucide-react";

export default function ImportEmployeeModal() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // États pour le Toast
    const [toast, setToast] = useState({ show: false, message: "", success: true });
    
    // État pour afficher le succès de l'import localement
    const [importedCount, setImportedCount] = useState<number | null>(null);

    const showToast = (message: string, success: boolean) => {
        setToast({ show: true, message, success });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
    };

    const getFileInfo = (fileName: string) => {
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (extension === 'xlsx' || extension === 'xls') {
            return {
                icon: <FileSpreadsheet className="w-10 h-10 text-emerald-600" />,
                bg: "bg-emerald-50",
                text: "text-emerald-700"
            };
        }
        if (extension === 'csv') {
            return {
                icon: <FileText className="w-10 h-10 text-blue-600" />,
                bg: "bg-blue-50",
                text: "text-blue-700"
            };
        }
        return {
            icon: <FileUp className="w-10 h-10 text-gray-500" />,
            bg: "bg-gray-50",
            text: "text-gray-700"
        };
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragActive(true);
        } else if (e.type === "dragleave") {
            setIsDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            const ext = droppedFile.name.split('.').pop()?.toLowerCase();
            if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
                setFile(droppedFile);
                setImportedCount(null); // Reset le compteur si on change de fichier
            }
        }
    };

    const handleImport = async () => {
        if (!file) return;
        try {
            setLoading(true);
            const result = await importEmployees(file);
            console.log(result);
            
            setImportedCount(result.successCount);
            showToast("Importation réussie !", true);
        } catch (e) {
            console.error(e);
            showToast("Erreur lors de l'importation.", false);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setImportedCount(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white rounded-2xl shadow-sm border border-gray-100 relative">
            <div className="mb-5">
                <h3 className="text-lg font-semibold text-gray-900">Importer des employés</h3>
                <p className="text-sm text-gray-500 mt-1">Sélectionnez ou glissez un fichier au format Excel ou CSV.</p>
            </div>

            {/* Badge élégant pour le nombre d'employés importés */}
            {importedCount !== null && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm font-medium animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{importedCount} employé{importedCount > 1 ? 's ont été ajoutés' : ' a été ajouté'} avec succès !</span>
                </div>
            )}

            {/* Zone de Drag & Drop / Sélection */}
            {!file ? (
                <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200
                        ${isDragActive 
                            ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]" 
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept=".xlsx,.xls,.csv"
                        onChange={(e) => {
                            if (e.target.files?.length) {
                                setFile(e.target.files[0]);
                                setImportedCount(null);
                            }
                        }}
                    />
                    <div className="p-3 bg-gray-50 rounded-full mb-3 text-gray-400">
                        <FileUp className="w-6 h-6 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 text-center">
                        <span className="text-indigo-600 hover:text-indigo-700">Cliquez pour téléverser</span> ou glissez-déposez
                    </p>
                    <p className="text-xs text-gray-400 mt-1">XLSX, XLS ou CSV (Max. 10Mo)</p>
                </div>
            ) : (
                /* Aperçu du fichier sélectionné */
                <div className={`flex items-center justify-between p-4 rounded-xl border border-gray-100 ${getFileInfo(file.name).bg}`}>
                    <div className="flex items-center space-x-3 min-w-0">
                        {getFileInfo(file.name).icon}
                        <div className="min-w-0">
                            <p className={`text-sm font-medium truncate ${getFileInfo(file.name).text}`}>
                                {file.name}
                            </p>
                            <p className="text-xs text-gray-400">
                                {(file.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        disabled={loading}
                        onClick={handleRemoveFile}
                        className="p-1 rounded-full hover:bg-black/5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Actions */}
            <div className="mt-5 flex justify-end space-x-3">
                {file && importedCount === null && (
                    <button
                        onClick={handleImport}
                        disabled={loading}
                        className="w-full flex items-center justify-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Importation en cours...
                            </>
                        ) : (
                            "Valider l'importation"
                        )}
                    </button>
                )}
            </div>

            {/* Ton composant Toast intégré */}
            <Toast 
                message={toast.message} 
                success={toast.success} 
                show={toast.show} 
            />
        </div>
    );
}