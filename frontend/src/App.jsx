import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import LandingPage from './LandingPage';
import UploadPage from './UploadPage';
import ResultPage from './ResultPage';
import Header from './components/Header';
import Footer from './components/Footer';
import Contact from './Contact';
import ResultChatPage from './ResultChatPage';
import DoctorSearchPage from './DoctorSearchPage';
import LoginPage from './components/LoginPage';

function App() {
  // Global state for selected image type and processed data
  const [selectedImageType, setSelectedImageType] = useState(null);
  const [processedData, setProcessedData] = useState(null);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/sign-in/*" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/upload"
            element={
              <>
                <SignedIn>
                  <UploadPage 
                    selectedImageType={selectedImageType} 
                    setSelectedImageType={setSelectedImageType} 
                    setProcessedData={setProcessedData} 
                  />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/results"
            element={
              <>
                <SignedIn>
                  <ResultPage 
                    processedData={processedData} 
                    selectedImageType={selectedImageType} 
                  />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/resultchat"
            element={
              <>
                <SignedIn>
                  <ResultChatPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/search-doctor"
            element={
              <>
                <SignedIn>
                  <DoctorSearchPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
