import { ethers, ContractTransaction } from "ethers";
import { toast } from "react-toastify";

export const handleTransaction = async (
  tx: ContractTransaction,
  message: string
) => {
  const toastId = toast.loading(message);

  try {
    const receipt = await tx.wait();

    toast.update(toastId, {
      render: "Transaction successful",
      type: "success",
      isLoading: false,
      autoClose: 5000,
      closeButton: true,
    });

    return receipt;
  } catch (error: any) {
    if (error.code === ethers.utils.Logger.errors.TRANSACTION_REPLACED) {
      toast.update(toastId, {
        render: "Original transaction has been replaced",
        type: "warning",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });

      if (error.receipt?.status === 1) {
        toast.success("Replacement transaction successful");
        return;
      } else {
        toast.error("Replacement transaction failed");
        return;
      }
    }

    toast.update(toastId, {
      render: "Transaction failed",
      type: "error",
      isLoading: false,
      autoClose: 5000,
      closeButton: true,
    });

    throw error;
  }
};
