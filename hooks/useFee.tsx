import { useEffect, useState } from "react";
import { useGetTradeFee } from "@/services/mutations/swap.mutations";

const useFee = (feeIsWavered: boolean) => {
    const { data: res } = useGetTradeFee()
    const [fee, setFee] = useState({
        adFee: feeIsWavered ? 0 : 0,
        orderFee: 0,
    });
    const fetchFee = async () => {
        try {
            if (res) {
                if (feeIsWavered) {
                    setFee({
                        adFee: 0,
                        orderFee: Number(res.data.orderFee),
                    });
                } else {
                    setFee({
                        adFee: Number(res.data.adFee),
                        orderFee: Number(res.data.orderFee),
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchFee();

        // Set up an interval to fetch the fee every 5 minutes
        const intervalId = setInterval(fetchFee, 5 * 60 * 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return { fee };
};

export default useFee;
