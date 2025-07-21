import React, { useState } from 'react';
import axios from '../../lib/axios';
import { User2, Mail, Phone, MapPin, Globe, Pencil, Linkedin, Github,  Briefcase, FileText, Link, Star } from 'lucide-react';
import { FaYoutube, FaDribbble, FaBehance, FaFigma } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';


export default function UserAdditionalInfo({ user, setUser, setAlert }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    bio: user.bio || '',
    location: user.location || '',
    phone: user.phone || '',
    website: user.website || '',
    linkedin: user.linkedin || '',
    github: user.github || '',
    figma: user.figma || '',
    portfolio: user.portfolio || '',
    dribbble: user.dribbble || '',
    behance: user.behance || '',
    youtube: user.youtube || '',
    skills: user.skills?.join(', ') || '',
    isAvailableForWork: user.isAvailableForWork || false,
    resume: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      setForm((prev) => ({ ...prev, resume: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      for (const key in form) {
        if (form[key] !== undefined && form[key] !== null) {
          if (key === "skills") {
            formData.append(key, form[key]);
          } else if (key === "resume" && form.resume instanceof File) {
            formData.append("resume", form.resume);
          } else {
            formData.append(key, form[key]);
          }
        }
      }

      const { data } = await axios.put("/api/auth/update-info", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(data.user);
      setAlert({ type: "success", message: "Additional info updated successfully" });
      setEditMode(false);
    } catch (error) {
      console.error(error);
      setAlert({
        type: "error",
        message: error?.response?.data?.message || "Update failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      bio: user.bio || '',
      location: user.location || '',
      phone: user.phone || '',
      website: user.website || '',
      linkedin: user.linkedin || '',
      github: user.github || '',
      figma: user.figma || '',
      portfolio: user.portfolio || '',
      dribbble: user.dribbble || '',
      behance: user.behance || '',
      youtube: user.youtube || '',
      skills: user.skills?.join(', ') || '',
      isAvailableForWork: user.isAvailableForWork || false,
      resume: null,
    });
    setEditMode(false);
  };

  const fieldEmpty = !user.bio && !user.phone && !user.website && !user.location && !user.skills?.length;

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-head font-semibold">Additional Info</h2>
        {!editMode && (
          <button
            className="text-sm "
            onClick={() => setEditMode(true)}
          >
            {fieldEmpty ? (
              <AiOutlinePlus className="text-slate-500 w-5 h-5 cursor-pointer" />
            ) : (
              <FiEdit className="text-slate-500 w-5 h-5 cursor-pointer" />
            )}

          </button>
        )}
      </div>

      {editMode ? (
        <>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Your bio"
            className="w-full border rounded p-2"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="border rounded p-2" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="border rounded p-2" />
            <input name="website" value={form.website} onChange={handleChange} placeholder="Website" className="border rounded p-2" />
            <input name="portfolio" value={form.portfolio} onChange={handleChange} placeholder="Portfolio" className="border rounded p-2" />
            <input name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="LinkedIn" className="border rounded p-2" />
            <input name="github" value={form.github} onChange={handleChange} placeholder="GitHub" className="border rounded p-2" />
            <input name="figma" value={form.figma} onChange={handleChange} placeholder="Figma" className="border rounded p-2" />
            <input name="dribbble" value={form.dribbble} onChange={handleChange} placeholder="Dribbble" className="border rounded p-2" />
            <input name="behance" value={form.behance} onChange={handleChange} placeholder="Behance" className="border rounded p-2" />
            <input name="youtube" value={form.youtube} onChange={handleChange} placeholder="YouTube" className="border rounded p-2" />
          </div>

          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="Skills (comma separated)"
            className="w-full border rounded p-2 mt-4"
          />

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              name="isAvailableForWork"
              checked={form.isAvailableForWork}
              onChange={handleChange}
            />
            <label>Available for Work</label>
          </div>

          <div className="mt-4">
            <label className="block mb-2 font-medium">Upload Resume (PDF)</label>
            <input type="file" accept="application/pdf" name="resume" onChange={handleChange} />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSubmit}
              className="bg-black text-white px-5 py-2 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-200 px-5 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <div className="space-y-4 text-[15px] text-black">

          {/* Bio Section */}
          <div>
            <h2 className="font-head text-lg mb-1">Bio</h2>
            <p className="font-med text-slate-700">
              {user.bio || <span className="text-gray-400">Add bio</span>}
            </p>
          </div>

          {/* Two Column Layout for Contact + Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Left Column */}
            <div className="space-y-3 text-slate-700 ">
              {/* Location */}
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="font-med">
                  {user.location || <span className="text-gray-400">Add location</span>}
                </span>
              </p>

              {/* Phone */}
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                <span className="font-med">
                  {user.phone || <span className="text-gray-400">Add phone number</span>}
                </span>
              </p>

              {/* Website */}
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-500" />
                <span className="font-med">
                  {user.website ? (
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className=" underline">
                      {user.website}
                    </a>
                  ) : (
                    <span className="text-gray-400">Add website</span>
                  )}
                </span>
              </p>

              {/* Availability */}
              <p>
                <span className="font-head">Availability:</span>{' '}
                <span className="font-med">
                  {user.isAvailableForWork ? (
                    <span className="text-green-600"> Available for work</span>
                  ) : (
                    <span className="text-gray-400">Not marked as available</span>
                  )}
                </span>
              </p>

              {/* Resume */}
              <p className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="font-med">
                  {user.resume?.url ? (
                    <a
                      href={user.resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View Resume
                    </a>
                  ) : (
                    <span className="text-gray-400">No resume uploaded</span>
                  )}
                </span>
              </p>
            </div>

            {/* Right Column - Social Links */}
            <div className="space-y-3 text-slate-700 break-words">
              {[
                { icon: <Linkedin className="w-4 h-4 text-slate-500" />, name: 'LinkedIn', value: user.linkedin },
                { icon: <Github className="w-4 h-4 text-slate-500" />, name: 'GitHub', value: user.github },
                { icon: <FaFigma className="w-4 h-4 text-slate-500" />, name: 'Figma', value: user.figma },
                { icon: <Link className="w-4 h-4 text-slate-500" />, name: 'Portfolio', value: user.portfolio },
                { icon: <FaDribbble className="w-4 h-4 text-slate-500" />, name: 'Dribbble', value: user.dribbble },
                { icon: <FaBehance className="w-4 h-4 text-slate-500" />, name: 'Behance', value: user.behance },
                { icon: <FaYoutube className="w-4 h-4 text-slate-500" />, name: 'YouTube', value: user.youtube },
              ].map(({ icon, name, value }) => (
                <p key={name} className="flex items-start gap-2 flex-wrap break-words text-sm">
                  {icon}
                  <span className="font-head">{name}:</span>{' '}
                  <span className="font-med break-all">
                    {value ? (
                      <a href={value} target="_blank" className="underline break-words">
                        {value}
                      </a>
                    ) : (
                      <span className="text-gray-400">Add {name} link</span>
                    )}
                  </span>
                </p>
              ))}
            </div>

          </div>

          {/* Skills */}
          <div>
            <h2 className="font-head text-lg mb-2 mt-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-slate-500" /> Skills
            </h2>
            {user.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill, idx) => (
                  <span key={idx} className="bg-slate-100 px-3 py-1 rounded-full text-sm font-med text-black flex items-center gap-1">
                    <Star className="w-3 h-3 text-slate-400" /> {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 font-med">Add skills</p>
            )}
          </div>

        </div>



      )}
    </div>
  );
}
