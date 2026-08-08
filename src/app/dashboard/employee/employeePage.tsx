"use client";

import React, { useState } from "react";
import AddEmployee from "./components/employee-form/AddEmployee";
import EmployeePageContent from "./components/table/EmployeeTableContents";
import type { Employee } from "@/types/employee/employee";

export default function EmployeePage() {
    const [activeTab, setActiveTab] = useState<"list" | "add">("list");
    const [employees, setEmployees] = useState<Employee[]>([]);

    const handleAddEmployee = (employee: Employee) => {
        setEmployees((prev) => [...prev, employee]);
        setTimeout(() => {
            setActiveTab("list");
        }, 5000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                    <nav className="flex space-x-0">
                        <button
                            onClick={() => setActiveTab("list")}
                            className={`
            flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-all duration-200
            first:rounded-l-xl last:rounded-r-xl
            ${activeTab === "list"
                                    ? "bg-gradient-to-r from-green-50 to-emerald-50 text-gray-900 border-b-2 border-green-500"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }
          `}
                        >
                            <i className="ri-group-line h-5 w-5 text-gray-400"></i>
                            <span>Employee List</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("add")}
                            className={`
            flex items-center space-x-3 px-6 py-4 text-sm font-medium transition-all duration-200
            first:rounded-l-xl last:rounded-r-xl
            ${activeTab === "add"
                                    ? "bg-gradient-to-r from-green-50 to-emerald-50 text-gray-900 border-b-2 border-green-500"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }
          `}
                        >
                            <i className="ri-user-add-line h-5 w-5 text-gray-400"></i>
                            <span>Add Employee</span>
                        </button>
                    </nav>
                </div>

                {/* Contenu — inchangé */}
                <div className="transition-all duration-300 ease-in-out">
                    {activeTab === "list" && (
                        <EmployeePageContent />
                    )}

                    {activeTab === "add" && (
                        <AddEmployee onAddEmployee={handleAddEmployee} />
                    )}
                </div>
            </div>
        </div>
    );
}
