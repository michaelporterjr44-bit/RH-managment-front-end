import axiosInstance from "@/api/axiosInstance";

export const importEmployees = async (file: File) => {

    const formData = new FormData();

    formData.append("file", file);

    const response = await axiosInstance.post(
        "/api/employees/import",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;

};