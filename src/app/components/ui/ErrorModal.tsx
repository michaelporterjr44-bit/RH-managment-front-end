"use client";

interface ErrorModalProps {
    open: boolean;
    title?: string;
    message: string;
    onClose: () => void;
}

export default function ErrorModal({
    open,
    title = "Une erreur est survenue",
    message,
    onClose,
}: ErrorModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">

                <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                        <i className="ri-close-circle-fill text-3xl text-red-600"></i>
                    </div>

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            {title}
                        </h2>

                        <p className="text-sm text-slate-500">
                            L'opération n'a pas pu être effectuée.
                        </p>
                    </div>

                </div>

                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">

                    <p className="whitespace-pre-line text-sm text-red-700">
                        {message}
                    </p>

                </div>

                <div className="mt-6 flex justify-end">

                    <button
                        onClick={onClose}
                        className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                        Fermer
                    </button>

                </div>

            </div>

        </div>
    );
}