import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { verifyEmail } from "../api/auth";
import { ApiError } from "../api/types";

export function EmailVerificationPage() {
  const [params] = useSearchParams();
  const [verificationState, setVerificationState] =
    useState<VerificationState>("Verifying");
  const [error, setError] = useState<string | null>(null);
  const consumed = useRef(false);

  useEffect(() => {
    async function run() {
      const token = params.get("token");

      if (consumed.current) {
        return;
      }

      if (token) {
        try {
          await verifyEmail(token);
          setVerificationState("Success");
        } catch (err) {
          if (err instanceof ApiError)
            setError(err.body?.message ?? "Something went wrong");
          setVerificationState("Error");
        } finally {
          consumed.current = true;
        }
      } else {
        setVerificationState("Error");
        setError("Missing verification token");
      }
    }

    run();
  }, []);

  return (
    <div className="emailverification">
      <h1>{verificationState}</h1>
      <p>{error}</p>
    </div>
  );
}

type VerificationState = "Verifying" | "Success" | "Error";
