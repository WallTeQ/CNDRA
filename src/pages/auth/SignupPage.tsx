import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Archive, CheckCircle } from "lucide-react";
import { SignupStep1 } from "../../components/auth/SignupStep1";
import { SignupStep2 } from "../../components/auth/SignupStep2";
import { SignupStep3 } from "../../components/auth/SignupStep3";
import { useAuth } from "../../hooks/useAuth";

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signupStep, setCurrentSignupStep, resetSignupFlow } = useAuth();

  const handleStepNext = () => {
    if (signupStep < 3) {
      setCurrentSignupStep((signupStep + 1) as 1 | 2 | 3);
    }
  };

  const handleStepBack = () => {
    if (signupStep > 1) {
      setCurrentSignupStep((signupStep - 1) as 1 | 2 | 3);
    }
  };

  const handleComplete = () => {
    resetSignupFlow();
    navigate("/login");
  };

  const renderStep = () => {
    switch (signupStep) {
      case 1:
        return <SignupStep1 onNext={handleStepNext} />;
      case 2:
        return <SignupStep2 onNext={handleStepNext} onBack={handleStepBack} />;
      case 3:
        return (
          <SignupStep3 onBack={handleStepBack} onComplete={handleComplete} />
        );
      default:
        return <SignupStep1 onNext={handleStepNext} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Archive className="h-10 w-10 text-red-600" />
            <span className="text-2xl font-bold text-slate-900">
              National Archive
            </span>
          </Link>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step < signupStep
                      ? "bg-green-500 text-white"
                      : step === signupStep
                      ? "bg-red-500 text-white"
                      : "bg-slate-300 text-slate-600"
                  }`}
                >
                  {step < signupStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      step < signupStep ? "bg-green-500" : "bg-slate-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="text-sm text-slate-600">
            Step {signupStep} of 3:{" "}
            {signupStep === 1
              ? "Email Verification"
              : signupStep === 2
              ? "Verify Code"
              : "Complete Profile"}
          </div>
        </div>

        {/* Step Content */}
        {renderStep()}

        {/* Footer */}
        <div className="text-center mt-8">
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
            ← Back to Public Site
          </Link>
        </div>
      </div>
    </div>
  );
};
