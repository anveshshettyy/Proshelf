import React, { useState } from 'react';
import axios from 'axios';
import { User2, Mail, Phone, MapPin, Globe, Pencil, Linkedin, Github, Twitter, Briefcase, FileText, Link, Star } from 'lucide-react';
import { FaYoutube, FaDribbble, FaBehance } from 'react-icons/fa';
import { RiEditFill } from "react-icons/ri";

export default function UserOverview({ user, setUser, setAlert }) {
  if (!user) return <p className="text-center">No user data available.</p>;

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null); // Local preview for image
  const [selectedFile, setSelectedFile] = useState(null);     // File to upload

  const [form, setForm] = useState({
    name: user.name || '',
    username: user.username || '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Update basic info
      const { data } = await axios.put(
        "/api/auth/update-user",
        { name: form.name, username: form.username },
        { withCredentials: true }
      );

      // If a new profile pic was selected, upload it
      if (selectedFile) {
        const formData = new FormData();
        formData.append("profilePic", selectedFile);

        const res = await axios.post("/api/auth/update-profile", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });

        data.user.profile = res.data.profileImage; // Add new profile image to user data
      }

      setUser(data.user);
      setEditMode(false);
      setAlert({ type: "success", message: "Profile updated successfully" });
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: err?.response?.data?.message || "Failed to update profile",
      });
    } finally {
      setLoading(false);
      setSelectedFile(null);
      setProfilePreview(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setProfilePreview(URL.createObjectURL(file)); // Show preview
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Profile Summary Card */}
      <div className="relative bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center gap-6">
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="absolute top-4 right-5 cursor-pointer text-slate-400 hover:text-black"
          >
            <RiEditFill className="h-5 w-5" />
          </button>
        )}
        <div className="h-32 w-32 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center relative">
          {profilePreview ? (
            <img src={profilePreview} alt="preview" className="h-full w-full object-cover" />
          ) : user.profile ? (
            <img src={user.profile} alt="profile" className="h-full w-full object-cover" />
          ) : (
            <User2 className="text-slate-400 w-12 h-12" />
          )}
          {editMode && (
            <label className="absolute bottom-0 left-0 right-0 bg-black/70 opacity-70 text-white text-[1.55vh] text-center py-2 cursor-pointer">
              Change Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          {editMode ? (
            <>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="block w-full mb-2 border rounded px-3 py-2"
              />
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Username"
                className="block w-full mb-2 border rounded px-3 py-2"
              />
              <div className="flex gap-2 mt-2 justify-center md:justify-start font-med">
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 cursor-pointer bg-black text-white rounded disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setForm({ name: user.name, username: user.username });
                    setProfilePreview(null);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 bg-gray-200 cursor-pointer text-black rounded"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-head">{user.name}</h1>
              <p className="text-slate-600">@{user.username}</p>
              {user.phone && (
                <p className="text-black font-med mt-2">
                  <Phone className="inline mr-2 w-4 h-4" /> {user.phone}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Rest of the details... (unchanged) */}
      {/* Keep your bio, social links, etc. sections same as before */}
      <div className="relative bg-white rounded-xl shadow p-6 space-y-5">
        {user.bio && (
          <div className="pt-4">
            <h2 className="font-head text-lg mb-2">Bio</h2>
            <p className="text-slate-600">{user.bio}</p>
          </div>
        )}


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-med text-black">
          {user.email && (
            <div><Mail className="inline w-4 h-4 mr-2 text-slate-400" /> {user.email}</div>
          )}
          {user.location && (
            <div><MapPin className="inline w-4 h-4 mr-2 text-slate-400" /> {user.location}</div>
          )}
          {user.website && (
            <div>
              <Globe className="inline w-4 h-4 mr-2 text-slate-400" />
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {user.website}
              </a>
            </div>
          )}
          <div>
            <Briefcase className="inline w-4 h-4 mr-2 text-slate-400" />
            {user.isAvailableForWork ? 'Available for Work' : 'Not Available'}
          </div>
          {user.linkedin && (
            <div><Linkedin className="inline w-4 h-4 mr-2 text-slate-400" /><a href={user.linkedin} target="_blank">LinkedIn</a></div>
          )}
          {user.github && (
            <div><Github className="inline w-4 h-4 mr-2 text-slate-400" /><a href={user.github} target="_blank">GitHub</a></div>
          )}
          {user.twitter && (
            <div><Twitter className="inline w-4 h-4 mr-2 text-slate-400" /><a href={user.twitter} target="_blank">Twitter</a></div>
          )}
          {user.portfolio && (
            <div><Link className="inline w-4 h-4 mr-2 text-slate-400" /><a href={user.portfolio} target="_blank">Portfolio</a></div>
          )}
          {user.dribbble && (
            <div><FaDribbble className="inline w-4 h-4 mr-2 text-slate-400" /><a href={user.dribbble} target="_blank">Dribbble</a></div>
          )}
          {user.behance && (
            <div><FaBehance className="inline w-4 h-4 mr-2 text-slate-400" /><a href={user.behance} target="_blank">Behance</a></div>
          )}
          {user.youtube && (
            <div><FaYoutube className="inline w-4 h-4 mr-2 text-slate-400" /><a href={user.youtube} target="_blank">YouTube</a></div>
          )}
          {user.resume?.url && (
            <div><FileText className="inline w-4 h-4 mr-2 text-slate-400" /><a href={user.resume.url} target="_blank">Resume</a></div>
          )}
        </div>

        {user.skills?.length > 0 && (
          <div>
            <h2 className="font-head text-lg mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-100 text-black rounded-full text-sm flex items-center gap-1">
                  <Star className="w-3 h-3 text-slate-400" /> {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
