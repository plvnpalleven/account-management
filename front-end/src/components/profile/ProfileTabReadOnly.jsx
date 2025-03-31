import React from "react";
import { formatDate } from "../../utils/formatDate";
import EditIcon from "@mui/icons-material/Edit";

const ProfileTabReadOnly = ({ profileData, onEdit }) => {
  return (
    <div className="p-4 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
      <h2 className="text-3xl font-bold text-center">My Profile</h2>
      <div className="max-w-5xl mx-auto">
        {/* Header Section (Profile Picture + Name + Position) */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center bg-transparent relative">
            <div className="relative">
              <img
                src={profileData.documents?.profilePicture.secure_url}
                alt="Profile"
                className="w-28 h-28 rounded-full border object-cover"
              />
              <button
                onClick={onEdit}
                className="absolute bottom-0 right-0 transform bg-sideInactive text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-sideActive"
              >
                <EditIcon fontSize="small" />
              </button>
            </div>
            <div className="mt-3 text-center">
              <h3 className="text-2xl font-semibold mt-2">
                {profileData.personalInfo?.firstName}{" "}
                {profileData.personalInfo?.lastName}
              </h3>
              <p className="text-xl text-gray-500">
                {profileData.jobInfo?.position}
              </p>
            </div>
          </div>
          {/* Personal Info */}
          <section className="p-4 rounded shadow-profile-section space-y-4 max-w-4xl w-full mx-auto">
            <h4 className="text-2xl font-bold mb-2">Personal Info</h4>
            <div className="grid grid-cols-2 gap-80 text-lg">
              {/* Left - Column */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">Name :</span>
                  <span className="ml-2 font-semibold text-gray-600">
                    {profileData.personalInfo.firstName}{" "}
                    {profileData.personalInfo.lastName}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">Age :</span>
                  <span className="ml-2 font-semibold text-gray-600">
                    {profileData.personalInfo.age} Years old
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">Email :</span>
                  <span className="ml-2 font-semibold text-gray-600">
                    {profileData.personalInfo.email}
                  </span>
                </div>
              </div>
              {/* Right - Col */}
              <div className="space-y-2 ml-2">
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">Position :</span>
                  <span className="ml-2 font-semibold text-gray-600">
                    {profileData.jobInfo.position}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">DOB :</span>
                  <span className="ml-2 font-semibold text-gray-600">
                    {formatDate(profileData.personalInfo.dateOfBirth)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">Phone :</span>
                  <span className="ml-2 font-semibold text-gray-600">
                    {profileData.personalInfo.phone}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Info */}
          <section className="p-4 rounded shadow-profile-section space-y-4 max-w-4xl w-full mx-auto">
            <h4 className="text-2xl font-bold mb-2">Additional Info</h4>
            <div className="grid grid-cols-2 gap-80 text-lg">
              {/* Left - Column */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">Nationality :</span>
                  <span className="ml-2 font-semibold text-gray-600">
                    {profileData.additionalInfo.nationality}
                  </span>
                </div>

                <div className="flex items-center">
                  <span className="font-bold text-gray-800">Religion :</span>
                  <span className="ml-2 font-semibold text-gray-600">
                    {profileData.additionalInfo.religion}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">
                    Marital Status :
                  </span>
                  <span className="ml-2 font-semibold text-gray-600">
                    {profileData.additionalInfo.maritalStatus}
                  </span>
                </div>
              </div>
              {/* Right - Col */}
              <div className="space-y-2  ml-2">
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">Ethnicity :</span>
                  <span className="ml-2 font-semibold text-gray-600">
                    {profileData.additionalInfo.ethnicity}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">
                    Military Status :
                  </span>
                  <span className="ml-2 font-semibold text-gray-600">
                    {profileData.additionalInfo.militaryStatus}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Address Info */}
          <section className="p-4 rounded shadow-profile-section space-y-4 max-w-4xl w-full mx-auto">
            <h4 className="text-2xl font-bold mb-2">Address</h4>
            <div className="space-y-2">
              <div className="text-lg col-span-2 flex items-center">
                <span className="font-bold text-gray-800 whitespace-nowrap">
                  Current Address :
                </span>
                <span className="ml-2 font-semibold text-gray-600">
                  {profileData.addressInfo.currentAddress}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-80 text-lg">
                {/* Left - Column */}

                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-bold text-gray-800">Street :</span>
                    <span className="ml-2 font-semibold text-gray-600">
                      {profileData.addressInfo.streetName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-gray-800">Province :</span>
                    <span className="ml-2 font-semibold text-gray-600">
                      {profileData.addressInfo.province}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-gray-800">
                      Postal Code :
                    </span>
                    <span className="ml-2 font-semibold text-gray-600">
                      {profileData.addressInfo.postalCode}
                    </span>
                  </div>
                </div>
                {/* Right - Col */}
                <div className="space-y-2 ml-2">
                  <div className="flex items-center">
                    <span className="font-bold text-gray-800">
                      Sub District :
                    </span>
                    <span className="ml-2 font-semibold text-gray-600">
                      {profileData.addressInfo.subDistrict}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-gray-800">Village :</span>
                    <span className="ml-2 font-semibold text-gray-600">
                      {profileData.addressInfo.villageName}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold text-gray-800">Country:</span>
                    <span className="ml-2 font-semibold text-gray-600">
                      Thailand
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Job Info */}
          <section className="p-4 rounded shadow-profile-section space-y-4 max-w-4xl w-full mx-auto">
            <h4 className="text-2xl font-bold mb-2">Job Info</h4>
            <div className="grid grid-cols-2 gap-80 text-lg">
              {/* Left - Column */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">Postion :</span>
                  <span className="ml-2 font-semibold text-gray-600">
                    {profileData.jobInfo.position}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800 whitespace-nowrap">
                    Expected Salary :
                  </span>
                  <span className="ml-2 font-semibold text-gray-600  whitespace-nowrap">
                    {profileData.jobInfo.expectedSalary} / Month
                  </span>
                </div>
              </div>
              {/* Right - Col */}
              <div className="space-y-2  ml-2">
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">Role :</span>
                  <span className="ml-2 font-semibold text-gray-600">
                    {profileData.role}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">
                    Access Status :
                  </span>
                  <span className="ml-2 font-semibold text-gray-600">
                    {profileData.accessStatus}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Documents */}

          {/* Documents */}
          <section className="p-4 rounded shadow-profile-section space-y-4 max-w-4xl w-full mx-auto">
            <h4 className="text-2xl font-bold mb-2">Documents</h4>
            <div className="grid grid-cols-2 gap-80 text-lg">
              {/* Left - Column */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">ID Card :</span>
                  <span className="ml-2 font-semibold text-gray-600">
                    <a
                      href={profileData.documents?.idCard.secure_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-profileTabText font-bold"
                    >
                      Click me
                    </a>
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">
                    House Registration :
                  </span>
                  <span className="ml-2 font-semibold text-gray-600">
                    <a
                      href={profileData.documents?.houseRegistration.secure_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-profileTabText font-bold"
                    >
                      Click me
                    </a>
                  </span>
                </div>
              </div>
              {/* Right - Column */}
              <div className="space-y-2 ml-2">
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">Diploma :</span>
                  <span className="ml-2 font-semibold text-gray-600">
                    <a
                      href={profileData.documents?.diploma.secure_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-profileTabText font-bold"
                    >
                      Click me
                    </a>
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">
                    Bank Account :
                  </span>
                  <span className="ml-2 font-semibold text-gray-600">
                    <a
                      href={profileData.documents?.bankAccount.secure_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-profileTabText font-bold"
                    >
                      Click me
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfileTabReadOnly;
