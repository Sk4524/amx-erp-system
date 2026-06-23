"use client";

import { useEffect, useState } from "react";

import Sidebar from "../../components/Sidebar";

import AuthGuard from "../../components/AuthGuard";

import api from "../../lib/api";

import toast from "react-hot-toast";
import Image from "next/image";

export default function ProfilePage() {

  const [profile, setProfile] =
    useState<any>(null);

  const [name, setName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [avatarFile, setAvatarFile] =
    useState<File | null>(null);

  const [preview,
    setPreview] =
    useState("");

  const [oldPassword, setOldPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");
  const [profileLoading,
    setProfileLoading] =
    useState(false);

  const [avatarLoading,
    setAvatarLoading] =
    useState(false);

  const [passwordLoading,
    setPasswordLoading] =
    useState(false);

  const fetchProfile = async () => {

    try {

      const res =
        await api.get("/profile");

      const data =
        res.data.data || res.data;

      setProfile(data);

      setName(
        data.name || ""
      );

      setPhone(
        data.phone || ""
      );



    } catch (err) {

      console.log(err);

      toast.error(
        "Failed to load profile"
      );
    }
  };

  useEffect(() => {

    fetchProfile();

  }, []);

  const updateProfile = async () => {

    if (!name.trim()) {

      toast.error(
        "Name is required"
      );

      return;
    }

    if (
      phone &&
      !/^[0-9]{10}$/.test(phone)
    ) {

      toast.error(
        "Phone number must be 10 digits"
      );

      return;
    }

    try {

      setProfileLoading(true);

      await api.put(
        "/profile",
        {
          name: name.trim(),
          phone: phone.trim(),
        }
      );

      toast.success(
        "Profile Updated"
      );

      fetchProfile();

    } catch (err) {

      console.log(err);

      toast.error(
        "Update failed"
      );

    } finally {

      setProfileLoading(false);

    }
  };


  const uploadAvatar = async () => {

    if (!avatarFile) {

      toast.error(
        "Please select an image"
      );

      return;
    }


    if (
      !avatarFile.type.startsWith(
        "image/"
      )
    ) {

      toast.error(
        "Only image files allowed"
      );

      return;
    }

    if (
      avatarFile.size >
      5 * 1024 * 1024
    ) {

      toast.error(
        "Max file size is 5MB"
      );

      return;
    }

    try {
      setAvatarLoading(true);


      const formData =
        new FormData();

      formData.append(
        "avatar",
        avatarFile
      );

      await api.post(
        "/profile/avatar",
        formData
      );

      toast.success(
        "Avatar Updated"
      );

      setAvatarFile(null);
      setPreview("");

      fetchProfile();

    } catch (err) {

      console.log(err);

      toast.error(
        "Avatar upload failed"
      );
    }
    finally {

      setAvatarLoading(false);

    }
  };


  const changePassword = async () => {


    if (
      !oldPassword ||
      !newPassword
    ) {

      toast.error(
        "Fill all password fields"
      );

      return;
    }

    if (
      newPassword.length < 8
    ) {

      toast.error(
        "Password must be at least 8 characters"
      );

      return;
    }

    if (
      !/[A-Z]/.test(newPassword)
    ) {

      toast.error(
        "Password must contain one uppercase letter"
      );

      return;
    }

    if (
      !/[0-9]/.test(newPassword)
    ) {

      toast.error(
        "Password must contain one number"
      );

      return;
    }

    if (
      oldPassword === newPassword
    ) {

      toast.error(
        "New password must be different"
      );

      return;
    }

    try {
      setPasswordLoading(true);

      await api.put(
        "/profile/password",
        {
          oldPassword,
          newPassword,
        }
      );

      setOldPassword("");
      setNewPassword("");

      toast.success(
        "Password Changed"
      );

      await fetchProfile();

    } catch (err: any) {

      toast.error(
        err?.response?.data?.message ||
        "Password change failed"
      );
    }
    finally {

      setPasswordLoading(false);

    }
  };

  if (!profile) {

    return (

      <AuthGuard>

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">

          <div className="bg-white p-10 rounded-3xl shadow-xl">

            <div className="w-14 h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-5"></div>

            <h2 className="text-2xl font-bold">

              Loading Profile

            </h2>

          </div>

        </div>

      </AuthGuard>

    );
  }

  return (

    <AuthGuard>

      <div className="flex">

        <Sidebar />

        <div className="ml-72 w-full px-6 xl:px-8 py-7 bg-gradient-to-br from-[#eef2f7] via-[#edf3ff] to-[#e5ebf3] min-h-screen text-black overflow-x-hidden">

          {/* HEADER */}

          <div className="relative overflow-hidden bg-white/75 backdrop-blur-2xl border border-white/50 shadow-[0_20px_70px_rgba(0,0,0,0.08)] rounded-[36px] p-6 xl:p-7 mb-10">

            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-cyan-50/30" />

            <div className="absolute -top-24 -right-24 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"></div>

            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl"></div>

            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500"></div>

            <div className="relative z-10">

              <div className="flex items-start gap-4">

                <div className="relative">

                  <div className="absolute inset-0 bg-cyan-500/30 blur-2xl rounded-full"></div>

                  <div className="relative bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-400 text-white p-4 rounded-[28px]">

                    👤

                  </div>

                </div>

                <div>

                  <p className="text-sm uppercase tracking-[0.30em] text-blue-600 font-bold">

                    Enterprise ERP

                  </p>

                  <h1 className="text-4xl sm:text-5xl xl:text-[46px] font-black text-[#0f172a] tracking-tight mt-2">

                    My Profile

                  </h1>

                  <div className="flex flex-wrap gap-3 mt-4">

                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">

                      USER SETTINGS

                    </div>

                    <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full">

                      ACCOUNT SECURITY

                    </div>

                  </div>

                </div>

              </div>

              <p className="text-gray-600 text-[14px] mt-6 max-w-2xl">

                Manage your profile information, security settings and account preferences.

              </p>

            </div>

          </div>

          {/* PROFILE STATS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-[32px] p-7 shadow-xl">

              <p className="text-white/80">
                Account Role
              </p>

              <h2 className="text-4xl font-black mt-4">
                {profile.role}
              </h2>

            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-7 shadow-lg">

              <p className="text-gray-500">
                Tenant
              </p>

              <h2 className="text-lg font-bold mt-4 break-all">
                {profile.tenantId}
              </h2>

            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-7 shadow-lg">

              <p className="text-gray-500">
                Email
              </p>

              <div className="mt-4 bg-slate-100 px-4 py-3 rounded-xl font-semibold break-all">

                {profile.email}

              </div>

            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-[32px] p-7 shadow-lg">

              <p className="text-gray-500">
                Last Login
              </p>

              <h2 className="text-lg font-bold mt-4">

                {
                  profile.lastLogin
                    ? new Date(
                      profile.lastLogin
                    ).toLocaleString()
                    : "Never"
                }

              </h2>

            </div>

          </div>


          <div className="bg-white/80 backdrop-blur-md p-7 rounded-[32px] shadow-xl border border-white/40 mb-10 flex items-center gap-6">

            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-cyan-400">

              <img
                src={
                  profile.avatar
                    ? `${process.env.NEXT_PUBLIC_API_URL}${profile.avatar}`
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      profile.name || profile.email
                    )}`
                }
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div>

              <h2 className="text-3xl font-black">
                {name || "User"}
              </h2>

              <p className="text-gray-500 mt-2">
                {profile.email}
              </p>

              <p className="text-cyan-600 font-semibold mt-2">
                {profile.role}
              </p>

            </div>

          </div>

          {/* PROFILE FORM */}

          <div className="bg-white/80 backdrop-blur-md p-7 rounded-[32px] shadow-xl border border-white/40 mb-10">

            <h2 className="text-3xl font-black mb-6">

              Profile Information

            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>

                <label className="font-semibold text-gray-600">
                  Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-2 p-4 rounded-2xl border border-gray-200 bg-white"
                />

              </div>

              <div>

                <label className="font-semibold text-gray-600">
                  Phone
                </label>

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-2 p-4 rounded-2xl border border-gray-200 bg-white"
                />

              </div>

              <div>

                <label className="font-semibold text-gray-600">

                  Email

                </label>

                <input
                  value={profile.email}
                  readOnly
                  className="w-full mt-2 p-4 rounded-2xl border border-gray-200 bg-slate-100 cursor-not-allowed"
                />

              </div>

              <div className="md:col-span-2">

                <label className="font-semibold text-gray-600">
                  Profile Picture
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {

                    const file =
                      e.target.files?.[0];

                    if (!file) return;

                    setAvatarFile(file);

                    setPreview(
                      URL.createObjectURL(file)
                    );

                  }}
                  className="w-full mt-2 p-4 rounded-2xl border border-gray-200 bg-white"
                />

                <button
                  disabled={avatarLoading}
                  onClick={uploadAvatar}
                  className="mt-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-3 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >

                  {
                    avatarLoading
                      ? "Uploading..."
                      : "Upload Avatar"
                  }

                </button>

              </div>


            </div>

            <button
              disabled={profileLoading}
              onClick={updateProfile}
              className="mt-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >

              {
                profileLoading
                  ? "Updating..."
                  : "Update Profile"
              }

            </button>

          </div>

          {/* PASSWORD */}

          <div className="bg-white/80 backdrop-blur-md p-7 rounded-[32px] shadow-xl border border-white/40">

            <h2 className="text-3xl font-black mb-6">

              Security Settings

            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="p-4 rounded-2xl border border-gray-200"
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="p-4 rounded-2xl border border-gray-200"
              />
              <p className="text-sm text-gray-500 mt-3">

                Password must contain
                at least 8 characters.

              </p>
            </div>

            <button
              disabled={passwordLoading}
              onClick={changePassword}
              className="mt-6 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg  disabled:opacity-50 disabled:cursor-not-allowed"
            >

              {
                passwordLoading
                  ? "Updating..."
                  : "Change Password"
              }

            </button>

          </div>

        </div>

      </div>

    </AuthGuard>

  );

}