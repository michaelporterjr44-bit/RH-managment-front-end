import { downloadPayslip } from "@/api/dashboard/pay/payslip";

interface Props{
    modelPayId:string;
}

export default function PayslipButton({modelPayId}:Props){

    const handleDownload = async()=>{

        const blob = await downloadPayslip(modelPayId);

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;

        a.download = "fiche_de_paie.pdf";

        document.body.appendChild(a);

        a.click();

        a.remove();

        window.URL.revokeObjectURL(url);

    }

    return(

        <button
            onClick={handleDownload}
            className="rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-700"
        >

            Télécharger PDF

        </button>

    )

}