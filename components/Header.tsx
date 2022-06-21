import Image from 'next/image'
import React from 'react'
import { BeakerIcon, ChevronDownIcon, HomeIcon } from "@heroicons/react/solid"
import { StarIcon } from "@heroicons/react/outline"


const Header = () => {
    return (
        <div className="sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm">
            <h2>Capsule</h2>

            <div className="flex item-center mx-7 xl:min-w-[300px]">
                <HomeIcon className="h-5 w-5 " />
                <p className="flex-1 ml-2 hidden lg:inline">Home</p>
                <ChevronDownIcon className="h-5 w-5" />
            </div>



        </div>
    )
}

export default Header