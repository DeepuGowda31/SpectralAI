import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import {
  MapPin,
  UserSearch,
  Phone,
  Mail,
  Loader2,
  Map as MapIcon,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

const DoctorSearchPage = ({ defaultSpecialty = "" }) => {
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState(defaultSpecialty);
  const [doctors, setDoctors] = useState([]);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    patient_name: "",
    patient_gender: "",
    patient_email: "",
    appointment_date: "",
    appointment_time: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const doctorsPerPage = 6;
  const navigate = useNavigate();

  // Get today's date for minimum date in calendar
  const today = new Date().toISOString().split("T")[0];

  const paginatedDoctors = doctors.slice(
    (currentPage - 1) * doctorsPerPage,
    currentPage * doctorsPerPage
  );

  // Try get current location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });

        try {
          const res = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
              params: {
                lat: latitude,
                lon: longitude,
                format: "json",
              },
            }
          );

          const loc =
            res.data.address?.suburb ||
            res.data.address?.city ||
            res.data.address?.village ||
            "";
          setLocation(loc);
        } catch (err) {
          console.error("Error in reverse geocoding:", err);
        }
      },
      () => {
        console.warn("Geolocation permission denied or failed");
        setGeoError(true);
      }
    );
  }, []);

  // Geocode a location string to lat,lng
  const geocodeLocation = async (locStr) => {
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: locStr + ", India", format: "json", limit: 1 },
      });
      if (res.data && res.data.length > 0) {
        return {
          lat: parseFloat(res.data[0].lat),
          lng: parseFloat(res.data[0].lon),
        };
      }
    } catch (e) {
      console.error("Geocoding error:", e);
    }
    return null;
  };

  const handleSearch = async () => {
    if (!location) {
      alert("Please enter a location.");
      return;
    }
    setLoading(true);
    setDoctors([]);
    try {
      const centerCoords = await geocodeLocation(location);
      if (centerCoords) {
        setCoords(centerCoords);
      } else {
        alert("Could not find location on map.");
        setCoords(null);
      }

      const res = await axios.get("http://127.0.0.1:8000/api/search-doctors", {
        params: { location, specialty },
      });
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      alert("Failed to fetch doctors. Please try again.");
      setCoords(null);
    } finally {
      setLoading(false);
    }
  };

  const openAppointmentModal = (doctor) => {
    setSelectedDoctor(doctor);
    setFormData({
      patient_name: "",
      patient_gender: "",
      patient_email: "",
      appointment_date: "",
      appointment_time: "",
    });
    setFormError("");
    setFormSuccess(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDoctor(null);
    if (formSuccess) {
      navigate("/doctor-search"); // Redirect to doctor search page
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    // Basic validation
    if (
      !formData.patient_name ||
      !formData.patient_gender ||
      !formData.patient_email ||
      !formData.appointment_date ||
      !formData.appointment_time
    ) {
      setFormError("All fields are required.");
      setFormLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.patient_email)) {
      setFormError("Please enter a valid email address.");
      setFormLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/book-appointment/", {
        ...formData,
        doctor_name: selectedDoctor.name,
        doctor_specialty: selectedDoctor.specialty,
        doctor_location: selectedDoctor.location,
      });
      setFormSuccess(true);
    } catch (err) {
      setFormError("Failed to book appointment. Please try again.");
      console.error("Error booking appointment:", err);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-black rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <UserSearch size={28} /> Find Doctors Near You
      </h1>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative w-full sm:w-1/3">
          <MapPin className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>

        <div className="relative w-full sm:w-1/3">
          <UserSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Specialty (e.g. Cardiologist)"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="pl-10"
            disabled={loading}
          />
        </div>

        <Button
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 font-semibold"
        >
          {loading && <Loader2 className="animate-spin" size={18} />}
          Search
        </Button>
      </div>

      {geoError && (
        <p className="text-red-600 font-medium">
          Could not get your location automatically. Please enter manually.
        </p>
      )}

      {/* Map */}
      {coords ? (
        <MapContainer
          key={`${coords.lat}-${coords.lng}`}
          center={[coords.lat, coords.lng]}
          zoom={13}
          className="h-[400px] w-full rounded-xl shadow-md"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          />
          {doctors.map((doc, idx) => {
            const lat = parseFloat(doc.lat);
            const lng = parseFloat(doc.lng);
            if (isNaN(lat) || isNaN(lng)) return null;
            return (
              <Marker key={idx} position={[lat, lng]}>
                <Popup>
                  <strong>{doc.name}</strong>
                  <br />
                  {doc.specialty}
                  <br />
                  {doc.phone}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      ) : (
        <p className="text-gray-500 italic flex items-center gap-2">
          <MapIcon size={18} /> Map will show here after searching or location detection.
        </p>
      )}

      {/* List of doctors */}
      <div className="grid gap-6 pt-6">
        {!loading && doctors.length === 0 && (
          <p className="text-center text-gray-500 italic">No doctors found.</p>
        )}
        {paginatedDoctors.map((doc, idx) => (
          <div
            key={idx}
            className="border border-gray-300 dark:border-gray-700 p-5 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1 flex items-center gap-2">
              <UserSearch size={20} /> {doc.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-1">
              <strong>Specialty: </strong> {doc.specialty}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-1 flex items-center gap-2">
              <MapPin size={16} /> {doc.location}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Phone size={16} /> {doc.phone}
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2 px-4 py-2"
                onClick={() => window.open(`mailto:${doc.email || ""}`, "_blank")}
              >
                <Mail size={16} /> Contact
              </Button>
              <Button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700"
                onClick={() => openAppointmentModal(doc)}
              >
                <Calendar size={16} /> Book Appointment
              </Button>
            </div>
          </div>
        ))}
        {doctors.length > doctorsPerPage && (
          <div className="flex justify-center gap-2 pt-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Prev
            </Button>
            <Button
              disabled={currentPage * doctorsPerPage >= doctors.length}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Appointment Modal */}
      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 flex items-center gap-2"
                  >
                    <Calendar size={20} /> Book Appointment with {selectedDoctor?.name}
                  </Dialog.Title>
                  <div className="mt-4">
                    {formSuccess ? (
                      <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/50 dark:to-teal-900/50 p-6 rounded-xl shadow-lg text-center animate-fade-in">
                        <CheckCircle2 className="mx-auto text-green-500 dark:text-green-400 mb-4" size={48} />
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          Appointment Confirmed!
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Your appointment with {selectedDoctor?.name} has been successfully booked. A confirmation email has been sent to <span className="font-medium">{formData.patient_email}</span>.
                        </p>
                        <Button
                          onClick={closeModal}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
                        >
                          Back to Search
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-xl shadow-lg">
                        <form onSubmit={handleFormSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                              Full Name
                            </label>
                            <div className="relative">
                              <Input
                                name="patient_name"
                                value={formData.patient_name}
                                onChange={handleFormChange}
                                placeholder="Enter your full name"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                              />
                              <UserSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                              Gender
                            </label>
                            <div className="relative">
                              <select
                                name="patient_gender"
                                value={formData.patient_gender}
                                onChange={handleFormChange}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all"
                                required
                              >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                              </select>
                              <UserSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                              Email
                            </label>
                            <div className="relative">
                              <Input
                                name="patient_email"
                                type="email"
                                value={formData.patient_email}
                                onChange={handleFormChange}
                                placeholder="Enter your email"
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                              />
                              <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                              Appointment Date
                            </label>
                            <div className="relative">
                              <Input
                                name="appointment_date"
                                type="date"
                                value={formData.appointment_date}
                                onChange={handleFormChange}
                                min={today}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                              />
                              <Calendar className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                              Appointment Time
                            </label>
                            <div className="relative">
                              <Input
                                name="appointment_time"
                                type="time"
                                value={formData.appointment_time}
                                onChange={handleFormChange}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                required
                              />
                              <Calendar className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                          </div>
                          {formError && (
                            <p className="text-red-600 dark:text-red-400 text-sm font-medium bg-red-50 dark:bg-red-900/50 p-2 rounded-lg">
                              {formError}
                            </p>
                          )}
                          <div className="mt-6 flex gap-4">
                            <Button
                              type="submit"
                              disabled={formLoading}
                              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
                            >
                              {formLoading && <Loader2 className="animate-spin" size={18} />}
                              Book Appointment
                            </Button>
                            <Button
                              type="button"
                              onClick={closeModal}
                              className="flex-1 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-900 dark:text-gray-100 font-semibold py-2 rounded-lg transition-all"
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default DoctorSearchPage;