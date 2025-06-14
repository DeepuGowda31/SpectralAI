import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

const HIPAAModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const consentGiven = sessionStorage.getItem('hipaaConsent');
    if (!consentGiven) {
      setShowModal(true);
    }
  }, []);

  const handleAgree = () => {
    sessionStorage.setItem('hipaaConsent', 'true');
    setShowModal(false);
  };

  return (
    <Dialog open={showModal} className="backdrop-blur-sm">
      <DialogContent className="max-w-md w-full rounded-2xl p-8 bg-gradient-to-tr from-blue-50 via-white to-blue-100 dark:from-slate-800 dark:via-slate-900 dark:to-blue-900 shadow-xl border border-blue-300 dark:border-blue-700">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-extrabold text-blue-900 dark:text-blue-400">
            HIPAA Compliance & Data Use Notice
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
          <p>
            Our application strictly adheres to the{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              HIPAA (Health Insurance Portability and Accountability Act)
            </span>{" "}
            guidelines to ensure the privacy and security of your medical data.
          </p>

          <p>
            Your data is handled with the utmost confidentiality and may be used
            in <span className="font-medium text-blue-600 dark:text-blue-400">anonymized</span> form
            to improve our AI models, enhancing diagnostic accuracy and performance for all users.
          </p>

          <p>
            By clicking <span className="font-semibold italic">"I Agree"</span>, you consent to these terms.
          </p>
        </div>

        <Button
          onClick={handleAgree}
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400"
          aria-label="Agree to HIPAA compliance"
        >
          I Agree
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default HIPAAModal;
