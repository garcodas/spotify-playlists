import { SlSocialGithub } from "react-icons/sl";
import { BsTwitterX } from "react-icons/bs";
import { IoLogoInstagram } from "react-icons/io5";
import { TfiWrite } from "react-icons/tfi";
import { FaGitAlt } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 mt-0">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <p>
          garcodas &copy; {new Date().getFullYear()} Playlist Merge. All rights
          reserved.
        </p>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <a href="https://github.com/garcodas" className="hover:text-gray-200">
            <SlSocialGithub className="w-5 h-5" />
          </a>
          <a href="https://x.com/garcodas" className="hover:text-gray-200">
            <BsTwitterX className="w-5 h-5" />
          </a>
          <a
            href="https://www.instagram.com/garcodas/"
            className="hover:text-gray-200"
          >
            <IoLogoInstagram className="w-5 h-5" />
          </a>
          <a href="https://dev.to/garcodas" className="hover:text-gray-200">
            <TfiWrite />
          </a>
          <a
            href="https://github.com/garcodas/spotify-playlists.git"
            className="hover:text-gray-200"
          >
            <FaGitAlt />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
