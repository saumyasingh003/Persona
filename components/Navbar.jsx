import Image from "next/image";

const Navbar = () => {
  return (
    <header
      className="w-full flex items-center justify-between
                 h-16 sm:h-18 md:h-20
                 px-4 sm:px-6 md:px-12 lg:px-40 z-50 shadow-md"
      style={{ backgroundColor: "#D9D375" }}
    >
  
      <span className="text-lg sm:text-xl italic font-semibold text-gray-900">
        Persona
      </span>

      
      <Image
        src="/logo.png"
        alt="Persona Logo"
        width={72}
        height={72}
        className="w-10 sm:w-12 md:w-14 object-contain"
        priority
      />
    </header>
  );
};

export default Navbar;
