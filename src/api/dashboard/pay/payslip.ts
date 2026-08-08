import axiosInstance from "@/api/axiosInstance";

export const downloadPayslip = async (id: string) => {

    const response = await axiosInstance.get(
        `/api/payslip/${id}`,
        {
            responseType: "blob"
        }
    );

    return response.data;

};

export const downloadAllPayslips = async (campagneId: string) => {

    const response = await axiosInstance.get(
        `/api/payslip/campagne/${campagneId}`,
        {
            responseType: "blob"
        }
    );

    return response.data;

};