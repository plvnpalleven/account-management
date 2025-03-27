import React from "react";
import { Eye } from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";
import { formatDate } from "../../utils/formatDate.jsx"; // สมมติคุณแยกไว้ใน utils

const ProfileModal = ({ candidate, onClose }) => {
  if (!candidate) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl w-[450px] shadow-lg relative  max-h-[98vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-600 hover:text-gray-600 text-xl"
        >
          <CloseIcon fontSize="small" />
        </button>

        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={candidate.documents.profilePicture.secure_url}
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
          <div>
            <h2 className="text-xl font-bold text-profileModalHeader">
              {candidate.personalInfo.firstName}{" "}
              {candidate.personalInfo.lastName}
            </h2>

            <p className="text-gray-500">
              {candidate.personalInfo.age} Years Old
            </p>
            <p className="text-gray-500">{candidate.jobInfo.position}</p>

            <p className="text-gray-500">
              {candidate.jobInfo.expectedSalary.toLocaleString()} / month
            </p>
          </div>
        </div>

        {/* Contact Info */}
        <hr className="my-2 border-t-2" />
        <div className="mt-2">
          <h4 className="text-xl font-bold text-profileModalHeader mb-2">
            Contact
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <span className="font-semibold text-gray-600">Email:</span>
              <span className="ml-2 text-gray-600">
                {candidate.personalInfo.email}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold text-gray-600">Phone:</span>
              <span className="ml-2 text-gray-600">
                {candidate.personalInfo.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <hr className="my-2 border-t-2" />
        <div className="mt-2">
          <h3 className="text-xl font-bold text-profileModalHeader mb-2">
            Additional Info
          </h3>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Religion :</span>{" "}
              {candidate.additionalInfo.religion}
            </p>
            <p>
              <span className="font-semibold">Ethnicity :</span>{" "}
              {candidate.additionalInfo.ethnicity}
            </p>
            <p>
              <span className="font-semibold">Nationality :</span>{" "}
              {candidate.additionalInfo.nationality}
            </p>
            <p>
              <span className="font-semibold">Military Status :</span>{" "}
              {candidate.additionalInfo.militaryStatus}
            </p>
            <p>
              <span className="font-semibold">Marital Status :</span>{" "}
              {candidate.additionalInfo.maritalStatus}
            </p>
            <p>
              <span className="font-semibold">Date of Birth :</span>{" "}
              {formatDate(candidate.personalInfo.dateOfBirth)}{" "}
            </p>
          </div>
        </div>

        {/* Address */}
        <hr className="my-2 border-t-2" />
        <div className="mt-2">
          <h3 className="text-xl font-bold text-profileModalHeader mb-2">
            Address
          </h3>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600">
            <p className="col-span-2 truncate">
              <strong>Current Address : </strong>
              {candidate.addressInfo.currentAddress}
            </p>
            <p className="col-span-2">
              <strong>Sub District : </strong>
              {candidate.addressInfo.subDistrict}
            </p>
            <p className="col-span-2">
              <strong>Street Number : </strong>
              {candidate.addressInfo.streetName}
            </p>
            <p  className="col-span-2">
              <strong>Village Number : </strong>
              {candidate.addressInfo.villageNumber}
            </p>
            <p  className="col-span-2">
              <strong>Province : </strong>
              {candidate.addressInfo.province}
            </p>
            <p  className="col-span-2">
              <strong>Postal Code : </strong>
              {candidate.addressInfo.postalCode}
            </p>
          </div>
        </div>
        {/* Documents */}
        <hr className="my-2 border-t-2" />
        <div className="mt-2 text-gray-600">
          <h3 className="text-xl font-bold text-profileModalHeader mb-2">
            Documents
          </h3>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <ViewButton
              label="ID Card"
              link={candidate.documents.idCard.secure_url}
            />
            <ViewButton
              label="House Registration"
              link={candidate.documents.houseRegistration.secure_url}
            />
            <ViewButton
              label="Diploma"
              link={candidate.documents.diploma.secure_url}
            />
            <ViewButton
              label="Bank Account"
              link={candidate.documents.bankAccount.secure_url}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewButton = ({ label, link }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center bg-sideInactive text-white px-4 py-2 rounded-md hover:bg-sideActive transition text-sm font-semibold"
  >
    <Eye className="mr-2" size={16} /> {label}
  </a>
);

export default ProfileModal;
