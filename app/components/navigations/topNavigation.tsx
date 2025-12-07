import { auth } from "@/app/auth";
import UserDropdown from "./UserDropdown";

const TopNavigation = async () => {
  const session = await auth();
  return (
    <div className="flex flex-1 justify-between items-center px-9 bg-white text-black h-[7vh] border-b-[1px] border-black/20">
      <div className="flex items-center gap-3">
        {/* Co-branding spot: replace src with partner logo if needed */}
        {/* <Image src="/fleetco.png" width={120} height={30} alt="Co Brand" /> */}
      </div>
      <div className="flex gap-3 items-center">
        <UserDropdown
          imageSrc="https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100149.jpg?t=st=1753541121~exp=1753544721~hmac=97d073003530b562fde1ff78c4045722159b9f30825be2ed48e9d2acad9799f5&w=1380"
          userName={session?.user?.name}
          userRole="Fleet Manager"
        />
      </div>
    </div>
  );
};

export default TopNavigation;
