"use client";

interface SuccessModalProps {
    open: boolean;
    title?: string;
    message: string;
    onClose: () => void;
}

export default function SuccessModal({
    open,
    title = "Succès",
    message,
    onClose,
}: SuccessModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">

                <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                        <i className="ri-checkbox-circle-fill text-3xl text-green-600"></i>
                    </div>

                    <div>

                        <h2 className="text-lg font-bold text-slate-900">
                            {title}
                        </h2>

                        <p className="text-sm text-slate-500">
                            L'opération a été réalisée avec succès.
                        </p>

                    </div>

                </div>

                <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">

                    <p className="whitespace-pre-line text-sm text-green-700">
                        {message}
                    </p>

                </div>

                <div className="mt-6 flex justify-end">

                    <button
                        onClick={onClose}
                        className="rounded-lg bg-green-700 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-800"
                    >
                        OK
                    </button>

                </div>

            </div>

        </div>
    );
}