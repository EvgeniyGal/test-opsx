import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Clock, CheckCircle2, ArrowLeft, Mail } from "lucide-react";

export default function PendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        {/* Icon and Title */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-xl animate-pulse">
            <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
            Registration Pending
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            Your account is awaiting approval from an administrator
          </p>
        </div>

        {/* Success Alert */}
        <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border-blue-800 shadow-lg">
          <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-900 dark:text-blue-100 font-semibold text-base">
            Account Created Successfully
          </AlertTitle>
          <AlertDescription className="text-blue-800 dark:text-blue-200 mt-2 text-sm leading-relaxed">
            Thank you for registering! Your account has been created and is
            pending approval from an administrator. You will receive access
            once your account has been approved.
          </AlertDescription>
        </Alert>

        {/* What happens next */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-4 sm:mb-6">
            What happens next?
          </h2>
          <ul className="space-y-4 sm:space-y-5">
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mt-0.5 shadow-md">
                <span className="text-white text-sm sm:text-base font-bold">1</span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium mb-1">
                  Administrator Review
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  An administrator will review your registration request
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mt-0.5 shadow-md">
                <span className="text-white text-sm sm:text-base font-bold">2</span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium mb-1">
                  Approval Notification
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You'll be notified once your account is approved
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mt-0.5 shadow-md">
                <span className="text-white text-sm sm:text-base font-bold">3</span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium mb-1">
                  Start Using Platform
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You can then sign in and start using the platform
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Action Button */}
        <Button
          asChild
          variant="outline"
          className="w-full h-12 sm:h-14 text-base font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          <Link href="/auth/signin" className="flex items-center justify-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            Back to Sign In
          </Link>
        </Button>

        {/* Help text */}
        <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Questions? Contact your administrator or check your email for updates.
        </p>
      </div>
    </div>
  );
}
