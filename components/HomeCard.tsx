import Image from "next/image";


interface Props {
  title: string;
  img: string;
  description: string;
  handleClick: () => void;
  className: string;
}

const HomeCard = ({title, img, description, handleClick, className}: Props) => {
  return (
    <div
      className={`${className} px-4 py-6 flex flex-col justify-between w-full 
                      min-h-[260px] rounded-[14px] cursor-pointer xl:max-w-[270px]`}
      onClick={handleClick}
    >
      <div className="flex-center glassmorphism size-12 rounded-[10px]">
        <Image
          src={img}
          alt="meeting icon"
          width={27}
          height={27}
        />
      </div>
      <div className="flex-flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-lg font-normal">{description}</p>
      </div>
    </div>
  );
};

export default HomeCard;
