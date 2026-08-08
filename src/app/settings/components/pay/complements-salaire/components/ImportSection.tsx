"use client"

import type React from "react"

import { useState } from "react"

export function ImportSection() {
    const [isDragging, setIsDragging] = useState(false)
    const [fileName, setFileName] = useState<string | null>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const files = e.dataTransfer.files
        if (files.length > 0) {
            setFileName(files[0].name)
            console.log("File dropped:", files[0])
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            setFileName(files[0].name)
            console.log("File selected:", files[0])
        }
    }

    return (
        <div className="rounded-2xl bg-white p-6 shadow-md">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Importation de fichier</h3>

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${isDragging ? "border-green-500 bg-green-50" : "border-slate-300 bg-slate-50"
                    }`}
            >
                <i className="ri-upload-2-line mb-3 text-4xl text-green-700"></i>
                <p className="mb-2 text-sm font-medium text-slate-700">Glissez-déposez votre fichier ici</p>
                <p className="mb-4 text-xs text-slate-500">ou</p>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-green-700 px-6 py-2.5 font-medium text-white transition-colors hover:bg-green-800">
                    <i className="ri-upload-2-line text-lg"></i>
                    Importer fichier
                    <input type="file" onChange={handleFileSelect} className="hidden" accept=".csv,.xlsx,.xls" />
                </label>
                {fileName && <p className="mt-4 text-sm text-green-600">Fichier sélectionné: {fileName}</p>}
            </div>
        </div>
    )
}
