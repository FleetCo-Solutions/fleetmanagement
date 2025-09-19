import { auth } from "@/app/auth";
import Image from "next/image";
import CurrentPageTitle from "./CurrentPageTitle";



const TopNavigation = async () => {
  const session = await auth()
  return (
    <div className="flex justify-between items-center px-9 bg-white text-black h-[7vh] border-b-[1px] border-black/20">
      <div>
        <CurrentPageTitle />
      </div>
      <div className="flex gap-3 items-center">
        <div className="flex flex-col items-end">
          <span className="text-lg">{session?.user?.name}</span>{" "}
          <span className="text-sm">Fleet Manager</span>
        </div>
        <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
          <Image
            src="https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100149.jpg?t=st=1753541121~exp=1753544721~hmac=97d073003530b562fde1ff78c4045722159b9f30825be2ed48e9d2acad9799f5&w=1380"
            width={1380}
            height={1380}
            alt="User Avatar"
            className="object-cover"
          /><div className="font-black text-3xl text-[#004953]">FleetCo</div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
