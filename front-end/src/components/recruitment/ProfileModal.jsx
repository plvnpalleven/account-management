import React from "react";
import { Eye } from "lucide-react";

const ProfileModal = ({ candidate, onClose }) => {
  if (!candidate) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-xl w-[450px] shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-600 text-xl"
        >
          X
        </button>
        <div className="flex items-center space-x-4">
          <img
            src={candidate.documents.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
          <div>
            <h2 className="text-xl font-bold">
              {candidate.personalInfo.firstName}
              {candidate.personalInfo.lastName}
            </h2>
            <p className="text-gray-500">{candidate.jobInfo.position}</p>
            <p className="text-gray-500">
              {candidate.jobInfo.expectedSalary.toLocaleString()} / month
            </p>
          </div>
        </div>
        {/* Contact Info */}
        <div className="mt-2">
          <label className="font-bold text-black">Contact</label>
          <div className="flex">
            <div className="flex">
              <label className="font-semibold text-black">Email : </label>
              {candidate.personalInfo.email}
            </div>
            <div className="flex ml-10">
              <strong>Phone : </strong> {candidate.personalInfo.phone}
            </div>
          </div>
        </div>
        {/* Additional Info */}
        <div className="mt-2">
          <h3 className="font-bold">Additional Info</h3>
          {/* <p>
            <strong>Address:</strong>
            {candidate.addressInfo.currentAddress},
            {candidate.addressInfo.province},{candidate.addressInfo.postalCode}
          </p> */}
          <p>
            <strong>Religion : </strong>
            {candidate.additionalInfo.religion}
          </p>
          <p>
            <strong>Ethnicity : </strong>
            {candidate.additionalInfo.ethnicity}
          </p>
          <p>
            <strong>Nationality : </strong>
            {candidate.additionalInfo.nationality}
          </p>
          <p>
            <strong>Military Status : </strong>
            {candidate.additionalInfo.militaryStatus}
          </p>
          <p>
            <strong>Marital Status : </strong>
            {candidate.additionalInfo.maritalStatus}
          </p>
        </div>
        <div className="mt-2">
          <h3 className="font-bold">Address</h3>
          <p>
            <strong>Current Address : </strong>
            {candidate.addressInfo.currentAddress}
          </p>
          <p>
            <strong>Village Number : </strong>
            {candidate.addressInfo.villageNumber}
          </p>
          <p>
            <strong>Street Number : </strong>
            {candidate.addressInfo.streetName}
          </p>
          <p>
            <strong>Sub District : </strong>
            {candidate.addressInfo.subDistrict}
          </p>
          <p>
            <strong>Province : </strong>
            {candidate.addressInfo.province}
          </p>
          <p>
            <strong>Postal Code : </strong>
            {candidate.addressInfo.postalCode}
          </p>
        </div>
        {/* Documents */}
        <div className="mt-2">
          <h3 className="font-bold">Documents</h3>
          <div className="grid grid-cols-2 gap-2">
            <ViewButton label="ID Card" link={candidate.documents.idCard} />
            <ViewButton
              label="House Registration"
              link={candidate.documents.houseRegistration}
            />
            <ViewButton label="Diploma" link={candidate.documents.diploma} />
            <ViewButton
              label="Bank Account"
              link={candidate.documents.bankAccount}
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
    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
  >
    <Eye className="mr-2" size={16} /> View {label}
  </a>
);

export default ProfileModal;
