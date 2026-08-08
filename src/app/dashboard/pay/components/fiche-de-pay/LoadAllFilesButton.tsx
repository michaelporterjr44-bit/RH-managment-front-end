import { downloadAllPayslips } from "@/api/dashboard/pay/payslip";

interface Props {
    campagneId: string;
}

export default function DownloadAllPayslipButton({ campagneId }: Props) {

    const handleDownload = async () => {

        const blob = await downloadAllPayslips(campagneId);

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "fiches_de_paie.zip";

        document.body.appendChild(a);

        a.click();

        a.remove();

        window.URL.revokeObjectURL(url);

    }

    return (

        <button
            onClick={handleDownload}
            className="rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700"
        >
            Télécharger toutes les fiches
        </button>

    )

}