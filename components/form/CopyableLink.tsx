import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyableLinkProps {
    iconSrc: string;
    iconAlt: string;
    label: string;
    value: string;
}

const CopyableLink = ({ iconSrc, iconAlt, label, value }: CopyableLinkProps) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-2">
                <img
                    src={iconSrc}
                    alt={iconAlt}
                    className="h-5 w-5 object-contain"
                />
                <span className="text-sm truncate max-w-[200px]">
                    {label}: {value}
                </span>
            </div>
            <button
                onClick={copyToClipboard}
                className="ml-2 rounded-full p-2 hover:bg-gray-100"
            >
                {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                ) : (
                    <Copy className="h-4 w-4 text-gray-600" />
                )}
            </button>
        </div>
    );
};

export default CopyableLink;