import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Github, Aperture, QrCode } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Redux/features/authentication/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, qrCode, loading, mfaRequired } = useSelector(
    (state) => state.authentication
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (success && !qrCode && !mfaRequired) {
      navigate("/dashboard");
    }
  }, [success, qrCode, mfaRequired, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const toastId = toast.loading("Signing in...");

    try {
      const resultAction = await dispatch(loginUser(credentials));

      if (loginUser.fulfilled.match(resultAction)) {
        const { setupMfa, qrCode, mfaRequired } = resultAction.payload;

        if (mfaRequired) {
          toast.success("Please verify MFA", { id: toastId });
          navigate("/setup-mfa");
        } else if (setupMfa && qrCode) {
          toast.success("Please set up MFA", { id: toastId });
          navigate("/setup-mfa");
        } else {
          toast.success("Signed in successfully", { id: toastId });
          navigate("/dashboard");
        }
      } else if (loginUser.rejected.match(resultAction)) {
        toast.error(resultAction.payload?.message || "Login failed", {
          id: toastId,
        });
      }
    } catch {
      toast.error("An unexpected error occurred", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[400px] border border-[#2a2a2a]/20 shadow-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                className="border-gray-600 placeholder-gray-400 focus-visible:ring-my-purple"
                name="email"
                type="email"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label className="" htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                className="border-gray-600 placeholder-gray-400 focus-visible:ring-my-purple"
                name="password"
                type="password"
                required
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" disabled={loading} />
                <Label className="" htmlFor="remember">
                  Remember me
                </Label>
              </div>
              <a href="#" className=" text-sm underline">
                Forgot password?
              </a>
            </div>
            <Button
              type="submit"
              className="w-full bg-my-purple hover:bg-my-purple"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                OR CONTINUE WITH
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full border-my-purple hover:bg-my-purple transition-colors hover:text-white"
              disabled={loading}
            >
              <Github className="mr-2 h-4 w-4" /> GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full border-my-purple hover:bg-my-purple transition-colors hover:text-white"
              disabled={loading}
            >
              <Aperture className="mr-2 h-4 w-4" /> Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-center justify-center">
          Don't have an account?{" "}
          <a href="#" className="ml-1 text-my-purple hover:text-[#9d5bdf]">
            Sign up
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
