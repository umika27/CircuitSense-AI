import { cn } from "@/lib/utils";

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function FormInput({ label, className, error, ...props }: FormInputProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        className={cn(
          "w-full rounded-2xl border bg-white px-4 py-3 text-sm text-foreground outline-none transition",
          "placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-200",
          error && "border-red-300 focus:border-red-400 focus:ring-red-100",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </label>
  );
}
