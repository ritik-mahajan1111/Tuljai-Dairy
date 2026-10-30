import { useEffect, useState } from "react";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLock,
  FaSave,
  FaKey,
} from "react-icons/fa";

import toast from "react-hot-toast";

import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/profileService";

import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../i18n/LanguageContext";

import "../styles/profile.css";

const Profile = () => {

  const { login, token } = useAuth();

  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ==========================================
  // Load Profile
  // ==========================================
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const data = await getProfile();

      setForm({
        fullName: data.user?.fullName || "",
        email: data.user?.email || "",
        mobile: data.user?.mobile || "",
        address: data.user?.address || "",
      });

    } catch (error) {
      console.error("Profile loading error:", error);

      toast.error(
        error.response?.data?.message ||
          t("unableToLoadProfile")
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Handle Profile Input
  // ==========================================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // Update Profile
  // ==========================================
  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const data = await updateProfile(form);

      // Update local storage + AuthContext
      if (token && data.user) {
        login(token, data.user);
      }

      toast.success(
        t("profileUpdated")
      );

    } catch (error) {
      console.error("Profile update error:", error);

      toast.error(
        error.response?.data?.message ||
          t("unableToUpdateProfile")
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Password Input
  // ==========================================
  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // Change Password
  // ==========================================
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    try {
      setChangingPassword(true);

      await changePassword(passwordForm);

      toast.success(
        t("passwordChanged")
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {
      console.error(
        "Password change error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          t("unableToChangePassword")
      );
    } finally {
      setChangingPassword(false);
    }
  };

  // ==========================================
  // Loading
  // ==========================================
  if (loading) {
    return (
      <div className="profile-loading">

        <div className="spinner-border text-primary" />

        <p>
          {t("loadingProfile")}
        </p>

      </div>
    );
  }

  return (
    <div className="container-fluid profile-page">

      {/* ==========================================
          Page Header
      ========================================== */}
      <div className="profile-header mb-4">

        <div>

          <h2>
            {t("myProfile")}
          </h2>

          <p>
            {t("manageOwnerAccount")}
          </p>

        </div>

        <div className="profile-badge">

          <FaUser />

          {t("ownerAccount")}

        </div>

      </div>

      <div className="row g-4">

        {/* ==========================================
            Profile Information
        ========================================== */}
        <div className="col-lg-7">

          <div className="profile-card">

            <div className="profile-card-header">

              <div className="profile-section-icon">
                <FaUser />
              </div>

              <div>

                <h4>
                  {t("personalInformation")}
                </h4>

                <p>
                  {t("updateDairyOwnerDetails")}
                </p>

              </div>

            </div>

            <form onSubmit={saveProfile}>

              <div className="row">

                {/* Name */}
                <div className="col-md-6 mb-3">

                  <label>
                    {t("fullName")}
                  </label>

                  <div className="profile-input">

                    <FaUser />

                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder={t("enterFullName")}
                      required
                    />

                  </div>

                </div>

                {/* Mobile */}
                <div className="col-md-6 mb-3">

                  <label>
                    {t("mobileNumber")}
                  </label>

                  <div className="profile-input">

                    <FaPhone />

                    <input
                      type="tel"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleChange}
                      placeholder={t("enterMobile")}
                      required
                    />

                  </div>

                </div>

                {/* Email */}
                <div className="col-md-6 mb-3">

                  <label>
                    {t("emailAddress")}
                  </label>

                  <div className="profile-input">

                    <FaEnvelope />

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder={t("enterEmail")}
                    />

                  </div>

                </div>

                {/* Address */}
                <div className="col-md-6 mb-3">

                  <label>
                    {t("address")}
                  </label>

                  <div className="profile-input">

                    <FaMapMarkerAlt />

                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder={t("enterAddress")}
                    />

                  </div>

                </div>

              </div>

              <button
                type="submit"
                className="profile-save-btn"
                disabled={saving}
              >

                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm" />

                    {t("saving")}
                  </>
                ) : (
                  <>
                    <FaSave />

                    {t("saveChanges")}
                  </>
                )}

              </button>

            </form>

          </div>

        </div>

        {/* ==========================================
            Change Password
        ========================================== */}
        <div className="col-lg-5">

          <div className="profile-card">

            <div className="profile-card-header">

              <div className="profile-section-icon">
                <FaKey />
              </div>

              <div>

                <h4>
                  {t("changePassword")}
                </h4>

                <p>
                  {t("keepAccountSecure")}
                </p>

              </div>

            </div>

            <form
              onSubmit={handlePasswordSubmit}
            >

              {/* Current Password */}
              <div className="password-field">

                <label>
                  {t("currentPassword")}
                </label>

                <div className="profile-input">

                  <FaLock />

                  <input
                    type="password"
                    name="currentPassword"
                    value={
                      passwordForm.currentPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder={t("enterCurrentPassword")}
                    required
                  />

                </div>

              </div>

              {/* New Password */}
              <div className="password-field">

                <label>
                  {t("newPassword")}
                </label>

                <div className="profile-input">

                  <FaLock />

                  <input
                    type="password"
                    name="newPassword"
                    value={
                      passwordForm.newPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder={t("minimumSixCharacters")}
                    minLength="6"
                    required
                  />

                </div>

              </div>

              {/* Confirm */}
              <div className="password-field">

                <label>
                  {t("confirmNewPassword")}
                </label>

                <div className="profile-input">

                  <FaLock />

                  <input
                    type="password"
                    name="confirmPassword"
                    value={
                      passwordForm.confirmPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder={t("confirmNewPasswordPlaceholder")}
                    minLength="6"
                    required
                  />

                </div>

              </div>

              <button
                type="submit"
                className="password-btn"
                disabled={changingPassword}
              >

                {changingPassword ? (
                  <>
                    <span className="spinner-border spinner-border-sm" />

                    {t("updating")}
                  </>
                ) : (
                  <>
                    <FaKey />

                    {t("changePassword")}
                  </>
                )}

              </button>

            </form>

            <div className="security-note">

              <FaLock />

              <span>
                {t("passwordSecurityNote")}
              </span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;