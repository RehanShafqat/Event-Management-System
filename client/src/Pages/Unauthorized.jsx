"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, LogIn } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function UnauthorizedPage() {
    const handleGoBack = () => {
        window.history.back()
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="max-w-md w-full">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Access Denied</CardTitle>
                    <CardDescription className="text-center">You don't have permission to access this page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Unauthorized</AlertTitle>
                        <AlertDescription>
                            You need to be logged in with appropriate permissions to view this content.
                        </AlertDescription>
                    </Alert>

                    <div className="flex items-center justify-center">
                        <img src="/placeholder.svg?height=120&width=120" alt="Unauthorized" className="h-30 w-30 opacity-80" />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleGoBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                    <Button onClick={() => (window.location.href = "/login")}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default UnauthorizedPage
