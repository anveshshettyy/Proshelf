import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import ThreeScene from '../Components/ThreeScene';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div className='bg-gradient-to-br from-white to-gray-200  '>
        <section className="relative  w-full h-[100dvh] flex p-20 overfhide md:justify-evenly justify-center overflow-hidden px-6">
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

          <div className="hidden lg:block lg:w-180 lg:h-full">
            <ThreeScene />
          </div>
        </section>

        <div className=' w-full p-5 flex flex-col items-center gap-y-10 '>
          <div className='flex flex-col gap-5'>
            <h1 className='text-center font-head text-5xl'>Organize Every Detail</h1>
            <p className='text-center font-med text-xl text-gray-500 '>Store designs, prototypes, videos, and visuals that bring your project to life. From the first<br /> wireframe to the final polish — every detail matters, and this is where it lives.</p>
          </div>

          <div className='h-150 w-full lg:w-[80%] bg-slate-300 rounded-4xl'></div>
        </div>
      </div>

    </div>
  );
}
