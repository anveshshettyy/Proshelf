import { useAuth } from '../Context/AuthContext';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import CreateCollectionDrawer from '../Components/Collection/CreateCollectionDrawer';
import EditCollectionDrawer from '../Components/Collection/EditCollectionDrawer';
import CreateIcon from '../assets/Images/add.png';
import CreateIconB from '../assets/Images/addB.png';
import DeleteIcon from '../assets/Images/delete.png';
import DeleteIconB from '../assets/Images/deleteB.png';
import FolderIcon from '../assets/Images/folder.png';
import EditIcon from '../assets/Images/edit.png';
import { Folder } from 'lucide-react';
import ConfirmPopup from '../Components/ConfirmPopup';
import axiosInstance from '../lib/axios';

export default function Collections() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [editingCollection, setEditingCollection] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const requestDelete = (id) => {
    setSelectedId(id);
    setShowPopup(true);
  };

  const fetchCollections = async () => {
    try {
      const res = await axiosInstance.get('/api/category/', {
        withCredentials: true,
      });
      setCollections(res.data);
    } catch (err) {
      console.error('Error fetching collections:', err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleCreate = async () => {
    // Optional: You can also validate here before sending request
    const reservedSlugs = ["collections", "admin", "profile", "settings"];
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (reservedSlugs.includes(title.trim().toLowerCase())) {
      alert("This title is reserved. Please choose another.");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/api/category/create/${user._id}`,
        { title, description },
        { withCredentials: true }
      );
      setTitle('');
      setDescription('');
      setShowDrawer(false);
      setCollections((prev) => [...prev, res.data]);
    } catch (err) {
      console.error('Error creating collection:', err);

      if (err.response?.data?.message) {
        alert(err.response.data.message); // Show server error message if available
      } else {
        alert("Something went wrong while creating category.");
      }
    }
  };


  const handleEditClick = (collection) => {
    setEditingCollection(collection);
    setEditTitle(collection.title);
    setEditDescription(collection.description || '');
  };

  const handleUpdate = async () => {
    const reservedSlugs = ["collections", "admin", "profile", "settings"];

    if (!editTitle.trim()) {
      alert("New title is required");
      return;
    }

    if (reservedSlugs.includes(editTitle.trim().toLowerCase())) {
      alert("This title is reserved. Please choose another.");
      return;
    }

    try {
      const res = await axiosInstance.put(
        `/api/category/edit/${editingCollection._id}`,
        { title: editTitle, description: editDescription },
        { withCredentials: true }
      );

      const updatedCategory = res.data.category || res.data;

      setCollections((prev) =>
        prev.map((col) =>
          col._id === updatedCategory._id ? updatedCategory : col
        )
      );

      setEditingCollection(null);
    } catch (err) {
      console.error('Error updating collection:', err);

      if (err.response?.data?.message) {
        alert(err.response.data.message); // show server error like "Category not found" or "Title is reserved"
      } else {
        alert("Something went wrong while updating the collection.");
      }
    }
  };


  const handleDeleteConfirmed = async () => {
    try {
      await axiosInstance.delete(`/api/category/delete/${selectedId}`, { withCredentials: true });
      setCollections((prev) => prev.filter((col) => col._id !== selectedId));
    } catch (err) {
      console.error('Error deleting collection:', err);
    } finally {
      setShowPopup(false);
      setSelectedId(null);
    }
  };


  const toggleDrawer = () => {
    setShowDrawer((prev) => !prev);
  };




  return (
    <div>
      <Navbar />
      <div className='p-2 md:p-15 md:flex md:justify-between md:items-center'>
        <h1 className='text-5xl font-head'>Your Collections</h1>

        <div className='flex justify-around font-med gap-3 text-gray-500 mt-5 text-sm md:text-[2.3vh]'>
          <div
            className={`group border-2 rounded-2xl p-2 flex cursor-pointer items-center gap-2 transition duration-200 ${showDrawer
              ? 'border-black text-black shadow-lg'
              : 'border-gray-500 hover:border-black hover:text-black hover:shadow-lg'
              }`}
            onClick={toggleDrawer}
          >
            <div className='relative h-5 w-5'>
              <img
                className={`absolute inset-0 object-contain transition duration-200 ${showDrawer ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'
                  }`}
                src={CreateIcon}
                alt='Create Default'
              />
              <img
                className={`absolute inset-0 object-contain transition duration-200 ${showDrawer ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                src={CreateIconB}
                alt='Create Hover'
              />
            </div>
            <h1>Create Collection</h1>
          </div>

          {/* <div className='group border-2 rounded-2xl border-gray-500 p-2 flex cursor-pointer items-center gap-2 hover:border-black hover:text-black hover:shadow-lg duration-200 transition'>
            <div className='relative h-5 w-5'>
              <img
                className='absolute inset-0 object-contain opacity-100 group-hover:opacity-0 transition duration-200'
                src={DeleteIcon}
                alt='Delete Default'
              />
              <img
                className='absolute inset-0 object-contain opacity-0 group-hover:opacity-100 transition duration-200'
                src={DeleteIconB}
                alt='Delete Hover'
              />
            </div>
            <h1>Delete Collection</h1>
          </div> */}
        </div>
      </div>

      <div className='flex mt-5 md:mt-0'>
        {/* <div className='w-1/3 bg-yellow-500 h-[100vh] hidden md:block'></div> */}
        <div className='w-full'>
          {showDrawer && (
            <div className='w-full flex justify-center pb-10'>
              <div className='w-[90%] animate-drawerSlideDown'>
                <CreateCollectionDrawer
                  onClose={() => setShowDrawer(false)}
                  onSubmit={handleCreate}
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                />
              </div>
            </div>
          )}

          <div className='flex flex-col items-center justify-center md:gap-5 pb-10 gap-2'>
            {collections.length === 0 ? (
              <div className="text-center mt-10 text-slate-500">
                <p className="text-lg mb-4">No collections found. Create one!</p>
                <button
                  onClick={toggleDrawer}
                  className="bg-black cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                  + Create Collection
                </button>
              </div>
            ) : (
              collections.map((collection) => {
                const isEditing = editingCollection && editingCollection._id === collection._id;
                return (
                  <div key={collection._id} className='w-[90%]'>
                    {isEditing ? (
                      <div className=' mb-8 md:mb-2 animate-drawerSlideDown'>
                        <EditCollectionDrawer
                          onClose={() => setEditingCollection(null)}
                          onSubmit={handleUpdate}
                          title={editTitle}
                          setTitle={setEditTitle}
                          description={editDescription}
                          setDescription={setEditDescription}
                        />
                      </div>
                    ) : (
                      <div className='group p-3 md:px-10 md:py-5 bg-slate-200  transition duration-500 rounded-2xl flex items-center gap-x-5'>
                        <div className='relative h-10 w-10'>
                          <img
                            className='absolute inset-0 h-full w-full object-contain opacity-100 transition duration-200'
                            src={FolderIcon}
                            alt='Folder'
                          />
                        </div>

                        <div className='flex flex-col md:flex-row w-full md:items-center items-start justify-between'>
                          <div
                            onClick={() => navigate(`/projects/${collection._id}`)}
                            className='mb-2 md:mb-0 cursor-pointer'>
                            <h1 className='font-head'>{collection.title}</h1>
                            <h1 className='font-med font-thin text-sm'>
                              {collection.description}
                            </h1>
                          </div>

                          <div className='flex gap-5 items-center text-sm font-helvetica'>
                            <div
                              className='flex gap-1 items-center cursor-pointer'
                              onClick={() => handleEditClick(collection)}
                            >
                              <div className='relative h-4 w-4 md:h-5 md:w-5'>
                                <img
                                  className='absolute inset-0 h-full w-full object-contain opacity-100 transition duration-200'
                                  src={EditIcon}
                                  alt='Edit'
                                />
                              </div>
                              <h1>Edit</h1>
                            </div>

                            <div
                              className='flex gap-1 items-center cursor-pointer'
                              onClick={() => requestDelete(collection._id)}
                            >
                              <div className='relative h-4 w-4 md:h-5 md:w-5'>
                                <img
                                  className='absolute inset-0 h-full w-full object-contain opacity-100 transition duration-200'
                                  src={DeleteIconB}
                                  alt='Delete'
                                />
                              </div>
                              <h1>Delete</h1>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>
      </div>
      <ConfirmPopup
        isOpen={showPopup}
        message="Are you sure you want to delete this collection?"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => {
          setShowPopup(false);
          setSelectedId(null);
        }}
      />

    </div>

  );
}
