# Radiology(Medical AI) Diagnosis Platform

An AI-based medical imaging analysis platform that helps the Radiology Department quickly generate preliminary diagnoses from various medical imaging modalities. It reduces the time taken for diagnosis, improves efficiency, and provides doctors and patients with fast, reliable insights from medical scans.

## Features

### Medical Imaging Analysis
- *Multiple Imaging Modalities Support*:
  - X-ray Analysis
  - CT Scan (2D & 3D)
  - MRI (3D)
  - Ultrasound
- *AI-Powered Diagnosis*:
  - Real-time image analysis
  - Confidence scoring
  - Detailed medical reports
  - Cross-sectional view analysis for 3D scans

### Healthcare Integration
- *Doctor Search & Booking*:
  - Location-based doctor search
  - Specialty filtering
  - Appointment booking system
  - Automated email confirmations

### User Experience
- *Interactive Dashboard*:
  - Visual confidence scores
  - Detailed diagnosis reports
  - Medical recommendations
  - Interactive chat support

## Technical Stack

### Backend
- FastAPI (Python web framework)
- Google Gemini AI (Multimodal AI model)
- AWS S3 (Image storage)
- SMTP (Email notifications)

### AI Models
- Custom-trained models for each imaging modality
- Real-time inference
- Confidence scoring
- Cross-validation support

### Data Security
- Secure file uploads
- AWS S3 integration
- Environment variable protection
- HIPAA-compliant data handling

## Getting Started

### Prerequisites
- Python 3.8+
- AWS Account (for S3)
- Google Cloud Account (for Gemini AI)
- SMTP Server Access

### Environment Setup
1. Clone the repository:
bash
git clone [repository-url]
cd medical-ai-platform


2. Create a virtual environment:
bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate


3. Install dependencies:
bash
pip install -r requirements.txt


4. Set up environment variables:
Create a .env file with the following variables:
env
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
S3_BUCKET_NAME=your_bucket_name
GEMINI_API_KEY=your_gemini_api_key
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
<!-- SMTP_USERNAME=your_email
SMTP_PASSWORD=your_email_password -->


### Running the Application
1. Start the backend server:
bash
uvicorn main:app --reload


2. Access the API documentation:

http://localhost:8000/docs


## API Endpoints

### Medical Imaging Analysis
- POST /predict/xray/ - Upload and analyze X-ray images
- POST /predict/ct/2d/ - Analyze 2D CT scans
- POST /predict/ct/3d/ - Analyze 3D CT scans
- POST /predict/mri/3d/ - Analyze 3D MRI scans
- POST /predict/ultrasound/ - Analyze ultrasound images

### Report Generation
- POST /generate-report/{modality}/ - Generate detailed medical reports
- GET /get-latest-report/{modality}/ - Retrieve latest analysis report

### Healthcare Services
- POST /book-appointment/ - Book medical appointments
- GET /api/search-doctors - Search for doctors by location and specialty

### Dashboard & Analytics
- GET /generate-dashboard - Generate diagnostic dashboard
- GET /dashboard-metrics - Get analysis metrics
- POST /chat_with_report/ - Interactive chat support

## Security & Privacy

- All medical images are securely stored in AWS S3
- Environment variables protect sensitive credentials
- HIPAA-compliant data handling practices
- Secure email communication for appointments
- Regular security audits and updates

## Contributing

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This platform provides AI-powered preliminary diagnoses and should not replace professional medical advice. Always consult healthcare professionals for final diagnoses and treatment plans.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
