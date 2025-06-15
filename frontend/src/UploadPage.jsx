import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from "./components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './components/ui/card';
import { Progress } from './components/ui/progress';
import { Alert, AlertDescription } from './components/ui/alert';
import { Upload, X, Check, AlertCircle, Image } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageTypeSelector from './components/ImageTypeSelector';
import SegmentedImageViewer from './components/SegmentedImageViewer';

const UploadPage = ({ selectedImageType, setSelectedImageType, setProcessedData }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setError(null);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const BASE_API_URL = 'http://127.0.0.1:8000';

  const handleUpload = async () => {
    if (!file) return setError('Please select a file first.');
    if (!selectedImageType) return setError('Please select an image type first.');

    let predictionEndpoint = '';
    let reportEndpoint = '';

    try {
      if (selectedImageType === 'xray') {
        predictionEndpoint = `${BASE_API_URL}/predict/xray/`;
        reportEndpoint = `${BASE_API_URL}/generate-report/xray/`;
      } else if (selectedImageType === 'ct_2d') {
        predictionEndpoint = `${BASE_API_URL}/predict/ct/2d/`;
      } else if (selectedImageType === 'ct_3d') {
        predictionEndpoint = `${BASE_API_URL}/predict/ct/3d/`;
      } else if (selectedImageType === 'mri_2d') {
        predictionEndpoint = `${BASE_API_URL}/predict/mri/2d/`;
      } else if (selectedImageType === 'mri_3d') {
        predictionEndpoint = `${BASE_API_URL}/predict/mri/3d/`;
      } else if (selectedImageType === 'ultrasound') {
        predictionEndpoint = `${BASE_API_URL}/predict/ultrasound/`;
      } else {
        return setError('Unsupported image type selected.');
      }
    } catch (err) {
      return setError('Invalid image type format.');
    }

    try {
      setUploading(true);
      setError(null);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', file);

      const predictionRes = await axios.post(predictionEndpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      let reportData = {};
      if (selectedImageType === 'xray') {
        const reportRes = await axios.post(reportEndpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        reportData = reportRes.data;
      } else {
        reportData = predictionRes.data;
      }

      setProcessedData({
        predictions: predictionRes.data.predictions || null,
        report: reportData.report,
        disease: reportData.disease,
        symptoms: reportData.symptoms || [],
        imagePreview: preview,
        imageType: selectedImageType
      });

      navigate('/results', {
        state: {
          selectedImageType,
          processedData: {
            predictions: predictionRes.data.predictions || null,
            report: reportData.report,
            disease: reportData.disease,
            symptoms: reportData.symptoms || [],
            imagePreview: preview,
          },
        },
      });
    } catch (err) {
      console.error(err);
      setError('An error occurred during upload or analysis. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Card className="w-full shadow-md min-h-screen">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Upload Medical Image</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <ImageTypeSelector
              selectedImageType={selectedImageType}
              setSelectedImageType={setSelectedImageType}
            />
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div
            className={`border-2 border-dashed rounded-lg p-6 mb-4 transition-colors duration-300 ${
              preview ? 'border-blue-400 bg-blue-50' : 'border-slate-300 hover:border-blue-400'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();

              const droppedFile = e.dataTransfer.files[0];
              if (!droppedFile?.type.startsWith('image/')) {
                setError('Please upload an image file.');
                return;
              }

              setFile(droppedFile);
              setError(null);

              const reader = new FileReader();
              reader.onloadend = () => {
                setPreview(reader.result);
              };
              reader.readAsDataURL(droppedFile);
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
            />

            {preview ? (
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-xs mx-auto">
                  <img
                    src={preview}
                    alt="Preview"
                    className="object-cover rounded-md w-full max-h-64"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                      setPreview(null);
                      setError(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="mt-2 text-sm text-slate-500">{file?.name}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <div className="p-3 rounded-full bg-blue-100 mb-3">
                  <Upload className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium mb-1">Drag and drop your medical image here</p>
                <p className="text-xs text-slate-500 mb-3">or click to browse files</p>
                <p className="text-xs text-slate-400">
                  Support for DICOM, JPEG, PNG, and TIFF formats
                </p>
              </div>
            )}
          </div>

          {preview && (
            <div className="mt-6">
              <SegmentedImageViewer imageUrl={preview} imageType={selectedImageType} />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-500">
              {selectedImageType
                ? selectedImageType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                : 'Select image type first'}
            </span>
          </div>
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                Processing <span className="animate-pulse">...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" /> Upload & Analyze
              </span>
            )}
          </Button>
        </CardFooter>

        {/* Custom animation class for spinning */}
        <style>
          {`
            @keyframes spin-slow {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .animate-spin-slow {
              animation: spin-slow 2s linear infinite;
            }
          `}
        </style>
      </Card>

      {/* Modern Overlay Animation */}
      <AnimatePresence>
        {uploading && (
          <>
            {/* Semi-transparent blurred backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40"
            />

            {/* Floating loader card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="fixed inset-0 z-50 flex items-center justify-center"
            >
              <div className="relative bg-white/80 backdrop-blur-lg border border-blue-200 shadow-2xl rounded-2xl px-8 py-6 flex flex-col items-center gap-4 w-80 animate-fade-in-down">
                {/* Spinning loader ring */}
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full border-[5px] border-blue-500 border-t-transparent animate-spin" />
                  <div className="absolute inset-2 rounded-full bg-white" />
                </div>

                {/* Text content */}
                <p className="text-lg font-bold text-blue-700 tracking-wide">Analyzing Image</p>
                <p className="text-sm text-gray-600 text-center">
                  Upload in progress… Sit tight while we work on it.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default UploadPage;