type PrimaryButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
};

export default function PrimaryButton({
  children,
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`w-full py-2.5 rounded-md transition
        ${
          disabled
            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
    >
      {children}
    </button>
  );
}
