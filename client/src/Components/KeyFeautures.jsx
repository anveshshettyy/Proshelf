import React from 'react'
import { User, FolderKanban, ShieldCheck, Sparkles } from 'lucide-react';

function KeyFeautures() {
    return (
        <div className='w-full p-4 md:p-25'>
            <div className='flex flex-col md:flex-row gap-8 md:gap-0'>
                <div className='w-full md:w-[40%] md:pr-32 md:mt-10 p-5 md:p-0'>
                    <h1 className='text-3xl md:text-[7vh] font-med'>Key Features</h1>
                    <div className='w-[93%] h-[0.2vh] bg-black md:mt-3 mt-2 mb-3 md:mb-5'></div>
                    <p className='text-3vh font-med'>Explore the core highlights that make this platform the perfect space for creators to showcase, manage, and protect their work.</p>
                </div>
                
                <div className="w-full md:w-[60%] space-y-8">
                    <div className="w-full flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/2 p-4 md:p-5 flex flex-col gap-4 md:gap-5">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full shadow">
                                <User className="text-black w-5 h-5" />
                            </div>
                            <h1 className='text-xl md:text-2xl font-head'>Profile & Links</h1>
                            <h1 className='text-sm md:text-md font-helvetica'>Your profile isn't just a name—it's your digital identity. Add links to freelance platforms, GitHub, LinkedIn, or anywhere else. Make it easy for visitors to explore your professional presence.</h1>
                        </div>
                        <div className="w-full md:w-1/2 p-4 md:p-5 flex flex-col gap-4 md:gap-5">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full shadow">
                                <FolderKanban className="text-black w-5 h-5" />
                            </div>
                            <h1 className='text-xl md:text-2xl font-head'>Structured Projects</h1>
                            <h1 className='text-sm md:text-md font-helvetica'>Each project includes its own dedicated page with title, description, media, and metadata—making it easy to present work professionally and navigate between projects.</h1>
                        </div>
                    </div>
                    <div className="w-full flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-1/2 p-4 md:p-5 flex flex-col gap-4 md:gap-5">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full shadow">
                                <Sparkles className="text-black w-5 h-5" />
                            </div>
                            <h1 className='text-xl md:text-2xl font-head'>Built for Focused Creators</h1>
                            <h1 className='text-sm md:text-md font-helvetica'>Distraction-free layouts and intuitive workflows help you stay focused and productive. The clean interface minimizes clutter, so you can spend more time creating and less time managing tools.</h1>
                        </div>
                        <div className="w-full md:w-1/2 p-4 md:p-5 flex flex-col gap-4 md:gap-5">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full shadow">
                                <ShieldCheck className="text-black w-5 h-5" />
                            </div>
                            <h1 className='text-xl md:text-2xl font-head'>Secure and Private by Design</h1>
                            <h1 className='text-sm md:text-md font-helvetica'>Your data and media are safe. Projects and images are stored securely, with privacy in mind. You stay in control—only you can edit or delete your content, ensuring your work stays protected.</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default KeyFeautures