// import {
//   Card,
//   CardHeader,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Github, Aperture } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { loginStarted } from "../Redux/features/authentication/authSlice";

// const Login = () => {
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.authentication);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const credentials = {
//       email: formData.get("email"),
//       password: formData.get("password"),
//     };
//     console.log(credentials);
//     dispatch(loginStarted());
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e]">
//       <Card className="w-[400px] bg-[#1a1a1a] border border-[#2a2a2a]">
//         <CardHeader>
//           <h1 className="text-2xl font-bold text-center text-white">
//             Welcome Back
//           </h1>
//         </CardHeader>
//         <CardContent>
//           {error && (
//             <Alert
//               variant="destructive"
//               className="mb-4 bg-[#2a1a2a] border-[#7f3fbf]"
//             >
//               <AlertDescription className="text-[#ff6b6b]">
//                 {error}
//               </AlertDescription>
//             </Alert>
//           )}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label className="text-gray-300" htmlFor="email">
//                 Email
//               </Label>
//               <Input
//                 id="email"
//                 className="bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus-visible:ring-[#7f3fbf]"
//                 name="email"
//                 type="email"
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label className="text-gray-300" htmlFor="password">
//                 Password
//               </Label>
//               <Input
//                 id="password"
//                 className="bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus-visible:ring-[#7f3fbf]"
//                 name="password"
//                 type="password"
//                 required
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <Checkbox id="remember" />
//                 <Label className="text-gray-300" htmlFor="remember">
//                   Remember me
//                 </Label>
//               </div>
//               <a href="#" className="text-gray-300 text-sm underline">
//                 Forgot password?
//               </a>
//             </div>
//             <Button
//               type="submit"
//               className="w-full bg-[#e50914] hover:bg-[#f12a34] text-white"
//               disabled={loading}
//             >
//               {loading ? "Signing in..." : "Sign In"}
//             </Button>
//           </form>
//           <div className="relative my-6">
//             <div className="absolute inset-0 flex items-center">
//               <span className="w-full border-t" />
//             </div>
//             <div className="relative flex justify-center text-xs uppercase">
//               <span className="bg-background px-2 text-muted-foreground">
//                 OR CONTINUE WITH
//               </span>
//             </div>
//           </div>
//           <div className="flex flex-col gap-2">
//             <Button
//               variant="outline"
//               className="w-full bg-[#2a2a2a] border-[#7f3fbf] text-white hover:bg-[#7f3fbf] hover:text-white transition-colors"
//             >
//               <Github className="mr-2 h-4 w-4 text-gray-300" /> GitHub
//             </Button>
//             <Button
//               variant="outline"
//               className="w-full bg-[#2a2a2a] border-[#7f3fbf] text-white hover:bg-[#7f3fbf] hover:text-white transition-colors"
//             >
//               <Aperture className="mr-2 h-4 w-4 text-gray-300" /> Google
//             </Button>
//           </div>
//         </CardContent>
//         <CardFooter className="text-gray-400 text-sm text-center justify-center">
//           Don't have an account?{" "}
//           <a href="#" className="ml-1 text-[#7f3fbf] hover:text-[#9d5bdf]">
//             Sign up
//           </a>
//         </CardFooter>
//       </Card>
//     </div>
//   );
// };

// export default Login;

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
import { Github, Aperture } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Redux/features/authentication/authSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.authentication
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const resultAction = await dispatch(loginUser(credentials));
      if (loginUser.fulfilled.match(resultAction)) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.log("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e]">
      <Card className="w-[400px] bg-[#1a1a1a] border border-[#2a2a2a]">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center text-white">
            Welcome Back
          </h1>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert
              variant="destructive"
              className="mb-4 bg-[#2a1a2a] border-my-purple"
            >
              <AlertDescription className="text-[#ff6b6b]">
                {error}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                className="bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus-visible:ring-my-purple"
                name="email"
                type="email"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300" htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                className="bg-[#2a2a2a] border-gray-600 text-white placeholder-gray-400 focus-visible:ring-my-purple"
                name="password"
                type="password"
                required
                disabled={loading}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" disabled={loading} />
                <Label className="text-gray-300" htmlFor="remember">
                  Remember me
                </Label>
              </div>
              <a href="#" className="text-gray-300 text-sm underline">
                Forgot password?
              </a>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#e50914] hover:bg-[#f12a34] text-white"
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
              className="w-full bg-[#2a2a2a] border-my-purple text-white hover:bg-my-purple hover:text-white transition-colors"
              disabled={loading}
            >
              <Github className="mr-2 h-4 w-4 text-gray-300" /> GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full bg-[#2a2a2a] border-my-purple text-white hover:bg-my-purple hover:text-white transition-colors"
              disabled={loading}
            >
              <Aperture className="mr-2 h-4 w-4 text-gray-300" /> Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="text-gray-400 text-sm text-center justify-center">
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
