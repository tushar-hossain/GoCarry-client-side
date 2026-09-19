import { useEffect, useRef, useState } from "react";
import {
  User,
  Mail,
  Shield,
  Bell,
  Lock,
  KeyRound,
  ChevronRight,
  Save,
  UserRound,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Swal from "sweetalert2";
import { updateProfile } from "firebase/auth";

import useAuth from "@/hooks/useAuth";
import useUserRole from "@/hooks/useUserRol";

const Settings = () => {
  const { user, updatePass } = useAuth();
  const { role } = useUserRole();
  const fileInputRef = useRef(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    parcelUpdates: true,
    paymentNotifications: true,
    promotionalNotifications: false,
  });

  useEffect(() => {
    if (user) {
      setName(user?.displayName || "");
      setPhotoURL(user?.photoURL || "");
    }
  }, [user]);

  useEffect(() => {
    const savedNotifications = localStorage.getItem(
      "gocarry-notification-preferences",
    );

    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error("Failed to load notification preferences:", error);
      }
    }
  }, []);

  const menuItems = [
    {
      id: "profile",
      title: "Profile",
      icon: User,
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
    },
    {
      id: "security",
      title: "Security",
      icon: Shield,
    },
    {
      id: "password",
      title: "Password",
      icon: Lock,
    },
  ];

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // 2MB validation
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "File too large",
        text: "Please select an image smaller than 2MB.",
      });

      event.target.value = "";
      return;
    }

    // File type validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid image",
        text: "Please select a JPG, PNG, or WEBP image.",
      });

      event.target.value = "";
      return;
    }

    try {
      setIsUploadingPhoto(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGBB_API_KEY
        }`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (!result?.success) {
        throw new Error("Image upload failed.");
      }

      const uploadedImage = result?.data?.url;

      setPhotoURL(uploadedImage);

      Swal.fire({
        icon: "success",
        title: "Photo uploaded",
        text: "Your new profile photo is ready to save.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Photo upload error:", error);

      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: "Unable to upload your profile photo. Please try again.",
      });
    } finally {
      setIsUploadingPhoto(false);
      event.target.value = "";
    }
  };

  const handleSaveProfile = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Swal.fire({
        icon: "warning",
        title: "Name is required",
        text: "Please enter your full name.",
      });

      return;
    }

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "User not found",
        text: "Please login again.",
      });

      return;
    }

    try {
      setIsSavingProfile(true);

      await updateProfile(user, {
        displayName: trimmedName,
        photoURL: photoURL || null,
      });

      setName(trimmedName);

      Swal.fire({
        icon: "success",
        title: "Profile updated!",
        text: "Your profile information has been updated successfully.",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Profile update error:", error);

      Swal.fire({
        icon: "error",
        title: "Update failed",
        text:
          error?.message || "Unable to update your profile. Please try again.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleNotificationChange = (key) => {
    setNotifications((previous) => {
      const updated = {
        ...previous,
        [key]: !previous[key],
      };

      localStorage.setItem(
        "gocarry-notification-preferences",
        JSON.stringify(updated),
      );

      return updated;
    });
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();

    if (!newPassword || !confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Required fields",
        text: "Please enter your new password and confirm it.",
      });

      return;
    }

    if (newPassword?.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Password too short",
        text: "Your password must be at least 6 characters long.",
      });

      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Passwords do not match",
        text: "Please make sure both passwords are the same.",
      });

      return;
    }

    if (!user) {
      Swal.fire({
        icon: "error",
        title: "User not found",
        text: "Please login again.",
      });

      return;
    }

    try {
      setIsUpdatingPassword(true);

      await updatePass(newPassword);

      setNewPassword("");
      setConfirmPassword("");

      await Swal.fire({
        icon: "success",
        title: "Password updated!",
        text: "Your password has been changed successfully.",
        timer: 1600,
        showConfirmButton: false,
      });

      setActiveSection("security");
    } catch (error) {
      let errorMessage = "Unable to update your password. Please try again.";
      if (error?.code === "auth/requires-recent-login") {
        errorMessage =
          "For security reasons, please log in again before changing your password.";
      }

      if (error?.code === "auth/weak-password") {
        errorMessage = "Please choose a stronger password.";
      }

      Swal.fire({
        icon: "error",
        title: "Password update failed",
        text: errorMessage,
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const getAccountRole = () => {
    return role ?? "User";
  };

  const ProfileSection = () => {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#03373D]">
            Profile Information
          </h2>
        </div>

        {/* Profile Photo */}
        <div className="mb-6 flex items-center gap-4">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[#dedede] bg-[#f3f4f6]">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound className="h-7 w-7 text-[#71717A]" />
              )}
            </div>

            {isUploadingPhoto && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              </div>
            )}
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoChange}
            />

            <button
              type="button"
              disabled={isUploadingPhoto}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-[#03373D] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploadingPhoto ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4" />
                  Change Photo
                </>
              )}
            </button>

            <p className="mt-1 text-xs text-[#71717A]">
              JPG, PNG or WEBP. Max 2MB.
            </p>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#03373D]">
              Full Name
            </label>

            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-[#067A87] focus:ring-2 focus:ring-[#067A87]/10"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#03373D]">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="h-11 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-3 text-sm text-gray-500 outline-none"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#03373D]">
              Account Role
            </label>

            <input
              type="text"
              value={getAccountRole()}
              disabled
              className="h-11 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-500 outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={isSavingProfile || isUploadingPhoto}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#CAEB66] px-5 py-2.5 text-sm font-semibold text-[#03373D] transition hover:bg-[#b9dc5b] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingProfile ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  const NotificationsSection = () => {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#03373D]">
            Notification Preferences
          </h2>
        </div>

        <div className="space-y-4">
          <NotificationItem
            title="Parcel Updates"
            checked={notifications.parcelUpdates}
            onChange={() => handleNotificationChange("parcelUpdates")}
          />

          <div className="h-px bg-gray-100" />

          <NotificationItem
            title="Payment Notifications"
            checked={notifications.paymentNotifications}
            onChange={() => handleNotificationChange("paymentNotifications")}
          />

          <div className="h-px bg-gray-100" />

          <NotificationItem
            title="Promotional Notifications"
            checked={notifications.promotionalNotifications}
            onChange={() =>
              handleNotificationChange("promotionalNotifications")
            }
          />
        </div>
      </div>
    );
  };

  const SecuritySection = () => {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-[#03373D]">Security</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef8d5]">
                  <Mail className="h-5 w-5 text-[#03373D]" />
                </div>

                <div>
                  <p className="text-sm font-medium text-[#03373D]">
                    Email Verification
                  </p>

                  <p className="mt-1 text-xs text-[#71717A]">{user?.email}</p>
                </div>
              </div>

              {user?.emailVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Not Verified
                </span>
              )}
            </div>

            {/* Password */}
            <button
              type="button"
              onClick={() => setActiveSection("password")}
              className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-gray-100 p-4 text-left transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef8d5]">
                  <KeyRound className="h-5 w-5 text-[#03373D]" />
                </div>

                <div>
                  <p className="text-sm font-medium text-[#03373D]">
                    Change Password
                  </p>

                  <p className="mt-1 text-xs text-[#71717A]">
                    Update your account password.
                  </p>
                </div>
              </div>

              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>

            {/* Account security */}
            {/* <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eef8d5]">
                  <Shield className="h-5 w-5 text-[#03373D]" />
                </div>

                <div>
                  <p className="text-sm font-medium text-[#03373D]">
                    Account Security
                  </p>

                  <p className="mt-1 text-xs text-[#71717A]">
                    Your account is protected by Firebase Authentication.
                  </p>
                </div>
              </div>

              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div> */}
          </div>
        </div>
      </div>
    );
  };

  const PasswordSection = () => {
    return (
      <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#03373D]">
            Change Password
          </h2>
        </div>

        <form onSubmit={handleUpdatePassword}>
          <div className="max-w-xl space-y-5">
            {/* New Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#03373D]">
                New Password
              </label>

              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Enter new password"
                  className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-10 text-sm outline-none transition focus:border-[#067A87] focus:ring-2 focus:ring-[#067A87]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((previous) => !previous)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-[#03373D]"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <p className="mt-1.5 text-xs text-[#71717A]">
                Password must be at least 6 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#03373D]">
                Confirm New Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm new password"
                  className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-10 text-sm outline-none transition focus:border-[#067A87] focus:ring-2 focus:ring-[#067A87]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-[#03373D]"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1.5 text-xs text-red-500">
                  Passwords do not match.
                </p>
              )}
            </div>
          </div>

          {/* Password buttons */}
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="cursor-pointer rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-[#03373D] transition hover:bg-gray-50"
            >
              Clear
            </button>

            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#CAEB66] px-5 py-2.5 text-sm font-semibold text-[#03373D] transition hover:bg-[#b9dc5b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div>
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#03373D] sm:text-3xl">
            Settings
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="rounded-2xl bg-white p-3 shadow-sm">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`mt-1 flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-left transition first:mt-0 ${
                    isActive
                      ? "bg-[#eef8d5] font-semibold text-[#03373D]"
                      : "text-[#52525B] hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-5 w-5 shrink-0" />

                  <div className="min-w-0">
                    <p className="text-sm">{item.title}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="lg:col-span-2">
            {activeSection === "profile" && <ProfileSection />}

            {activeSection === "notifications" && <NotificationsSection />}

            {activeSection === "security" && <SecuritySection />}

            {activeSection === "password" && <PasswordSection />}
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationItem = ({ title, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[#03373D]">{title}</p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition ${
          checked ? "bg-[#067A87]" : "bg-gray-300"
        }`}
        aria-label={`Toggle ${title}`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
};

export default Settings;
