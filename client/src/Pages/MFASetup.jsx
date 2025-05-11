import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyMfa } from "../Redux/features/authentication/authSlice";
import { toast } from "sonner";

const MFASetup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, qrCode, secret, mfaRequired, setupMfa } = useSelector(
    (state) => state.authentication
  );

  // If no MFA setup or verification required, redirect to login
  if (!mfaRequired && !setupMfa) {
    navigate("/login");
    return null;
  }

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const toastId = toast.loading("Verifying...");

    try {
      const resultAction = await dispatch(
        verifyMfa({
          userId: user.id,
          code: code,
        })
      );

      if (verifyMfa.fulfilled.match(resultAction)) {
        toast.success("MFA verified successfully", { id: toastId });
        navigate("/dashboard");
      } else if (verifyMfa.rejected.match(resultAction)) {
        setError(resultAction.payload?.message || "Failed to verify MFA code");
        toast.error(
          resultAction.payload?.message || "Failed to verify MFA code",
          { id: toastId }
        );
      }
    } catch {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[400px] border border-[#2a2a2a]/20 shadow-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">
            {mfaRequired
              ? "Verify Two-Factor Authentication"
              : "Setup Two-Factor Authentication"}
          </h1>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 border-my-purple">
              <AlertDescription className="text-[#ff6b6b]">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-6">
            {setupMfa && qrCode && (
              <div className="text-center">
                <p className="mb-4">
                  Scan this QR code with your authenticator app (like Google
                  Authenticator or Authy)
                </p>
                <div className="flex justify-center">
                  <img
                    src={qrCode}
                    alt="MFA QR Code"
                    className="w-48 h-48 bg-white p-2 rounded-lg"
                  />
                </div>
                <p className="text-sm mt-2">
                  Or enter this code manually: {secret}
                </p>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label className="" htmlFor="code">
                  Enter 6-digit code
                </Label>
                <Input
                  id="code"
                  className="border-gray-600 placeholder-gray-400 focus-visible:ring-my-purple"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? "Verifying..."
                  : mfaRequired
                  ? "Verify"
                  : "Verify & Complete Setup"}
              </Button>
            </form>
          </div>
        </CardContent>
        <CardFooter className="text-gray-400 text-sm text-center justify-center">
          Having trouble?{" "}
          <a href="#" className="ml-1 text-[#7f3fbf] hover:text-[#9d5bdf]">
            Contact Support
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MFASetup;
