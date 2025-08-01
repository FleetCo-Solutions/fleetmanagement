import SidebarItem from "./sideBarItem";
import { sideBarItems } from "./sideBarItems";

const SideBarNavigation = () => {
  return (
    <div className="w-[6%] bg-[#EBEBEB] h-[100vh] border-r-[1px] border-black/10">
      <div className="w-full h-[7vh] bg-[#004953] flex justify-center items-center">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="size-9 fill-white"><path d="M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z"/></svg>
      </div>
      <ul className="text-black flex flex-col gap-1 my-5 font-extrabold">
        {sideBarItems.map((item, index) => (
          <SidebarItem
            key={index}
            route={item.route}
            itemName={item.itemName}
            itemIcon={item.itemIcon}
            subItems={item.children}
          />
        ))}
      </ul>
    </div>
  );
};

export default SideBarNavigation;
