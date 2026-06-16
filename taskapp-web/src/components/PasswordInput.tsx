import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  minLength?: number;
  placeholder?: string;
  autoComplete?: "current-password" | "new-password";
  className?: string;
};

export function PasswordInput(props: PasswordInputProps) {
  const [shown, setShown] = useState(false);
  return (
    <div className="password-input">
      <input {...props} type={shown ? "text" : "password"}></input>
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        aria-label={shown ? "Hide Password" : "Show Password"}
        className="password-toggle"
      >
        {shown ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
}
