import { FaEnvelope, FaGithub, FaLinkedin, FaArrowUp, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { HiArrowUpRight } from "react-icons/hi2";

const Footer = () => {
  return (
    <footer className="relative w-full bg-black text-white rounded-t-4xl px-6 py-8 md:px-16 md:py-2">
      <a
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="absolute top-6 right-6 cursor-pointer hover:text-gray-400 transition-transform duration-300 hover:-translate-y-1"
      >
        <FaArrowUp className="text-white text-xl md:text-2xl" />
      </a>


      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6">
        <div className="text-3xl md:text-[25vh] tracking-wide font-med flex gap-2 ">
          <h1>Proshelf</h1>
          <HiArrowUpRight className="text-white text-xl md:text-[25vh] text-[2.5vh] mt-2 md:mt-5" />
        </div>

        <div className='flex md:gap-x-32 gap-x-10 '>
          <div className="flex flex-col gap-3 text-sm font-helvetica md:text-[2.5vh]">
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-white" />
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=shettyanvesh86@gmail.com" target="_blank" className="hover:underline">Contact Me</a>
            </div>
            <div className="flex items-center gap-3">
              <FaLinkedin className="text-white" />
              <a href="https://www.linkedin.com/in/anveshshettyy/" target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
            </div>
            <div className="flex items-center gap-3">
              <FaGithub className="text-white" />
              <a href="https://github.com/anveshshettyy" target="_blank" rel="noreferrer" className="hover:underline">Github</a>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm  font-helvetica md:text-[2.5vh]">
            <div className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-white" />
              <span>Mangalore, India</span>
            </div>
            <div className="flex items-center gap-3">
              <FaPhone className="text-white" />
              <span>+91 6360478529</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
