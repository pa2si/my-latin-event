type EmailStatusProps = {
  isVerified: boolean;
  isPrimary: boolean;
};

const EmailStatus = ({ isVerified, isPrimary }: EmailStatusProps) => (
  <div className="flex items-center gap-2">
    <span
      className={`text-xs ${isVerified ? "text-green-600" : "text-yellow-600"}`}
    >
      {isVerified ? "Verified" : "Unverified"}
    </span>
    {isPrimary && (
      <span className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
        Primary
      </span>
    )}
  </div>
);

export default EmailStatus;
