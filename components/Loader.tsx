import Image from "next/image";

const Loader = () => {
  return (
    <div className="flex-center w-full h-screen">
      <Image 
        src="/icons/loading-circle.svg" 
        width={50} 
        height={50}
        alt="Loading"
      />
    </div>
  )
}

export default Loader;
