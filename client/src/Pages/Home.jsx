import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import ThreeScene from '../Components/ThreeScene';
import UIImage from '../assets/Images/Thumbnail.png';
import KeyFeautures from '../Components/KeyFeautures';
import Footer from '../Components/Footer';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div className='bg-gradient-to-br from-white to-gray-100  '>
        <section className="relative  w-full md:h-[100dvh] flex p-20 overfhide md:justify-evenly justify-center overflow-hidden px-6">
          <div className="z-10 max-w-2xl  md:px-30 md:py-10">
            <h1 className="text-5xl sm:text-5xl md:text-6xl font-extrabold leading-tight font-med text-gray-900">
              Project Storage,{' '}
              <span
                className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 bg-clip-text text-transparent "
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #b0b0b0 0%, #e0e0e0 50%, #b0b0b0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Reimagined
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-500 font-med">
              Effortlessly store and organize your project’s images, videos, designs, and code — all in one sleek, easy-to-use hub. Showcase your work, track your progress, and keep your creative flow unstoppable.
            </p>

            <div onClick={() => navigate('/collections')} className='border border-gray-500 py-3 flex items-center justify-center w-1/2 rounded-3xl  gap-4 group md:hover:bg-black duration-200 ease-in cursor-pointer mt-5 '  >
              <h1 className='text-1xl font-med md:group-hover:text-white duration-200 ease-in '>Get Started</h1>
              <div className='rounded-full bg-black h-3 w-3 md:group-hover:bg-white duration-200 ease-in  '></div>
            </div>
          </div>

          <div className="hidden h:0 lg:block lg:w-180 lg:h-full">
            <ThreeScene />
          </div>
        </section>

        <div className=' w-full p-5 flex flex-col items-center gap-y-10 mt-20 md:mt-0 '>
          <div className='flex flex-col gap-5 md:px-72'>
            <h1 className='text-center font-head md:text-5xl text-3xl'>Organize Every Detail</h1>
            <p className='text-center font-med md:text-xl text:md text-gray-500 '>Store designs, prototypes, videos, and visuals that bring your project to life. From the first wireframe to the final polish — every detail matters, and this is where it lives.</p>
          </div>

          <div className='h-150 w-full lg:w-[90%] bg-slate-300 '>
            <img className='w-full h-full object-fill ' src={UIImage} alt="" />
          </div>
        </div>


        <div className='h-auto w-full relative md:px-25 p-5 md:flex gap-x-10 mt-20'>
          <div className='w-full flex flex-col md:flex-row gap-y-8 md:gap-y-0 md:gap-x-8 items-center'>
            <div className='h-[28vh] w-full md:h-[60vh] md:w-[50vh] p-5 md:ml-15 flex flex-col md:hidden block '>
              <h1 className='text-3xl md:text-[7vh] font-med leading-10 md:leading-12'>About <br className="hidden md:block" /> this Platform</h1>
              <div className='w-full h-[0.2vh] bg-black md:mt-5 mt-2 mb-3 md:mb-12'></div>
              <h1 className='text-base md:text-[2.3vh] font-helvetica'>This platform is designed to help creatives, developers, and teams showcase their projects visually. With features like image galleries, detailed descriptions, and fullscreen previews, it's a simple yet powerful way to present your work, stay organized, and manage media with ease.</h1>
            </div>

            <div className="md:h-[60vh] md:w-[60vh] h-[40vh]  bg-gradient-to-br from-slate-800 via-gray-900 to-black text-white rounded-xl p-7 flex flex-col justify-between shadow-lg shadow-black/30 transition duration-300">


              <h1 className='text-2xl md:text-[4.5vh] font-helvetica-semi-bold leading-8'>Project <br className="hidden md:block" /> Galleries</h1>
              <h1 className='text-base md:text-[2.3vh] font-med tracking-wide'>Upload and organize project images in a clean, responsive layout. Whether it's design drafts or final assets, your media stays structured, scrollable, and easy to view.</h1>
            </div>

            <div
              className="h-[40vh] w-full md:h-[60vh] md:w-[60vh] bg-gradient-to-br from-slate-100 via-gray-200 to-gray-300 rounded-md p-5 md:p-7 flex flex-col justify-between border-b-2 border-l-2 border-gray-200 mb-4 md:mb-0  transition duration-300"
              style={{
                clipPath:
                  'polygon(50% 0%, 68% 16%, 100% 16%, 100% 100%, 25% 100%, 0 100%, 0 0)',
              }}
            >

              <h1 className='text-2xl md:text-[4.5vh] font-helvetica-semi-bold leading-8'>Easy Project <br />Management</h1>
              <h1 className='text-base md:text-[2.3vh] font-med -tracking-normal'>Control your content effortlessly. Rename projects, update information, or delete images with just a click. The UI is clean and intuitive, ensuring you spend less time managing and more time creating.</h1>
            </div>

            <div className='h-[40vh] w-full md:h-[60vh] md:w-[50vh] p-5 md:ml-15 flex flex-col md:block hidden '>
              <h1 className='text-3xl md:text-[7vh] font-med leading-10 md:leading-12'>About <br className="hidden md:block" /> this Platform</h1>
              <div className='w-full h-[0.2vh] bg-black md:mt-5 mt-2 mb-3 md:mb-12'></div>
              <h1 className='text-base md:text-[2.3vh] font-helvetica'>This platform is designed to help creatives, developers, and teams showcase their projects visually. With features like image galleries, detailed descriptions, and fullscreen previews, it's a simple yet powerful way to present your work, stay organized, and manage media with ease.</h1>
            </div>
          </div>
        </div>

        <KeyFeautures />

        <div className=' w-full p-5 md:p-25 md:mt-0 mt-20 mb-20 md:mb-0'>
          <div className='flex justify-center flex-col items-center'>
            <h1 className='font-med md:text-[4vh] text-xl'>Start Creating, Start Showcasing</h1>
            <p className='font-helvetica md:text-[3vh] text-md text-center text-gray-500'>Dive in and create your personalized project profile in minutes.</p>

            <div onClick={() => navigate('/collections')} className='border border-gray-500 py-3 flex items-center justify-center md:w-[20vw] w-[50vw] rounded-3xl  gap-4 group md:hover:bg-black duration-200 ease-in cursor-pointer mt-5 '  >
              <h1 className='text-1xl font-med md:group-hover:text-white duration-200 ease-in '>Get Started</h1>
              <div className='rounded-full bg-black h-3 w-3 md:group-hover:bg-white duration-200 ease-in  '></div>
            </div>
          </div>
        </div>


        <Footer />
      </div>

    </div>
  );
}
