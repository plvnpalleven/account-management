import React from "react";
import { formatDate } from "../../utils/formatDate";

const ProfileTabReadOnly = ({ profileData, onEdit }) => {
  return (
    <div className="p-4 space-y-6 max-h-[590px] overflow-y-auto custom-scrollbar">
      <h2 className="text-3xl font-bold mb-2">My Profile</h2>
      {/* Header Section (Profile Picture + Name + Position) */}
      <section className="flex items-center gap-4 bg-gray-50 p-4 rounded shadow">
        <img
          src={profileData.documents?.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full border object-cover"
        />
        <div className="flex-col ">
          <h3 className="text-xl font-semibold">
            {profileData.personalInfo?.firstName}{" "}
            {profileData.personalInfo?.lastName}
          </h3>
          <p className="text-gray-500">{profileData.jobInfo?.position}</p>
          <p className="text-gray-500">
            {profileData.jobInfo?.expectedSalary?.toLocaleString()} / month
          </p>
        </div>
        <button
          onClick={onEdit}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Edit Profile
        </button>
      </section>

      {/* Personal Info */}
      <section className="bg-gray-50 p-4 rounded shadow space-y-1">
        <h3 className="text-lg font-semibold mb-2">Personal Info</h3>
        <p>
          <strong>Phone:</strong> {profileData.personalInfo?.phone}
        </p>
        <p>
          <strong>Email:</strong> {profileData.personalInfo?.email}
        </p>
      </section>

      {/* Additional Info */}
      <section className="bg-gray-50 p-4 rounded shadow space-y-1">
        <h3 className="text-lg font-semibold mb-2">Additional Info</h3>
        <p>
          <strong>Religion:</strong> {profileData.additionalInfo?.religion}
        </p>
        <p>
          <strong>Ethnicity:</strong> {profileData.additionalInfo?.ethnicity}
        </p>
        <p>
          <strong>Nationality:</strong>{" "}
          {profileData.additionalInfo?.nationality}
        </p>
        <p>
          <strong>Military Status:</strong>{" "}
          {profileData.additionalInfo?.militaryStatus}
        </p>
        <p>
          <strong>Marital Status:</strong>{" "}
          {profileData.additionalInfo?.maritalStatus}
        </p>
      </section>

      {/* Address Info */}
      <section className="bg-gray-50 p-4 rounded shadow space-y-1">
        <h3 className="text-lg font-semibold mb-2">Address Info</h3>
        <p>
          <strong>Current Address:</strong>{" "}
          {profileData.addressInfo?.currentAddress}
        </p>
        <p>
          <strong>Village Number:</strong>{" "}
          {profileData.addressInfo?.villageNumber}
        </p>
        <p>
          <strong>Street Name:</strong> {profileData.addressInfo?.streetName}
        </p>
        <p>
          <strong>Sub District:</strong> {profileData.addressInfo?.subDistrict}
        </p>
        <p>
          <strong>Province:</strong> {profileData.addressInfo?.province}
        </p>
        <p>
          <strong>Postal Code:</strong> {profileData.addressInfo?.postalCode}
        </p>
      </section>

      {/* Job Info */}
      <section className="bg-gray-50 p-4 rounded shadow space-y-1">
        <h3 className="text-lg font-semibold mb-2">Job Info</h3>
        <p>
          <strong>Position:</strong> {profileData.jobInfo?.position}
        </p>
        <p>
          <strong>Expected Salary:</strong>{" "}
          {profileData.jobInfo?.expectedSalary}
        </p>
      </section>

      {/* Documents */}
      <section className="bg-gray-50 p-4 rounded shadow space-y-1">
        <h3 className="text-lg font-semibold mb-2">Documents</h3>
        <p>
          <strong>ID Card:</strong>{" "}
          <a
            href={profileData.documents?.idCard}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            View
          </a>
        </p>
        <p>
          <strong>House Registration:</strong>{" "}
          <a
            href={profileData.documents?.houseRegistration}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            View
          </a>
        </p>
        <p>
          <strong>Diploma:</strong>{" "}
          <a
            href={profileData.documents?.diploma}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            View
          </a>
        </p>
        <p>
          <strong>Bank Account:</strong>{" "}
          <a
            href={profileData.documents?.bankAccount}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            View
          </a>
        </p>
      </section>
    </div>
  );
};

export default ProfileTabReadOnly;
