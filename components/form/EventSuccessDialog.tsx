import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogAction,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import CopyableLink from "./CopyableLink";

const EventSuccessDialog = ({
    isOpen,
    onClose,
    paypalUsername = "your-paypal@email.com",
    cryptoWallet = "your-crypto-wallet-address",
    bitcoinAddress = "your-bitcoin-address"
}: {
    isOpen: boolean;
    onClose: () => void;
    paypalUsername?: string;
    cryptoWallet?: string;
    bitcoinAddress?: string;
}) => {
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold text-green-600">
                        Congratulations! 🎉
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-4">
                        <p className="text-lg">
                            You have successfully published your new event!
                        </p>

                        <div className="mt-6 space-y-4">
                            <p className="text-sm text-gray-600">
                                Donations are welcome to help cover maintenance costs of this event calendar:
                            </p>

                            <div className="space-y-3">
                                <CopyableLink
                                    iconSrc="/paypal.svg"
                                    iconAlt="PayPal"
                                    label="PayPal"
                                    value={paypalUsername}
                                />
                                <CopyableLink
                                    iconSrc="/metamask.svg"
                                    iconAlt="Metamask"
                                    label="Metamask"
                                    value={cryptoWallet}
                                />
                                <CopyableLink
                                    iconSrc="/bitcoin.svg"
                                    iconAlt="Bitcoin"
                                    label="Bitcoin"
                                    value={bitcoinAddress}
                                />
                            </div>
                        </div>

                        <p className="mt-6 text-center text-sm text-gray-600">
                            Keep enjoying My Latin Events!
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onClose} className="w-full">
                        Back to Events
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default EventSuccessDialog;