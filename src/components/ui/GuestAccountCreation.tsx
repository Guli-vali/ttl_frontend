'use client';

import { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { useProfileStore } from '@/store/useProfileStore';

interface GuestAccountCreationProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function GuestAccountCreation({ onSuccess, onError }: GuestAccountCreationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepMessage, setStepMessage] = useState('');
  const createGuestAccount = useProfileStore((state) => state.createGuestAccountAndJoin);

  const steps = [
    { number: 1, message: 'Creating temporary account...' },
    { number: 2, message: 'Waiting for registration completion...' },
    { number: 3, message: 'Logging in...' }
  ];

  useEffect(() => {
    const createAccount = async () => {
      try {
        setCurrentStep(1);
        setStepMessage(steps[0].message);
        
        // Simulate delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setCurrentStep(2);
        setStepMessage(steps[1].message);
        await new Promise(resolve => setTimeout(resolve, 600));
        
        setCurrentStep(3);
        setStepMessage(steps[2].message);
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Create account
        const success = await createGuestAccount();
        
        if (success) {
          onSuccess();
        } else {
          onError('Failed to create guest account');
        }
      } catch {
        onError('An error occurred while creating account');
      }
    };

    createAccount();
  }, [createGuestAccount, onSuccess, onError]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl">
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Creating guest account
          </h3>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
          
          {/* Current step */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Step {currentStep} of {steps.length}
            </p>
            <p className="text-gray-800 font-medium">
              {stepMessage}
            </p>
          </div>
          
          {/* Loading indicator */}
          <div className="flex justify-center">
            <LoadingSpinner size="md" variant="inline" />
          </div>
          
          <p className="text-xs text-gray-500 mt-4">
            This will take just a few seconds...
          </p>
          

        </div>
      </div>
    </div>
  );
}
