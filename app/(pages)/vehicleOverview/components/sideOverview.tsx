import React, { useState } from "react";

const SideOverview = ({
  openOverview,
  setOpenOverview,
}: {
  openOverview: boolean;
  setOpenOverview: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
    const [VehicleDetals, setVehicleDetails] = useState(false);
  return (
    <>
      {openOverview ? (
        <div className="flex h-[94vh] bg-orange-900">
          <div className="w-[350px] bg-white text-black border-r-[1px] border-black/10">
            <div className="text-xl font-bold text-black border-b-[1px] border-black/30 p-3 flex items-center justify-between">
              <span>Vehicles</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 cursor-pointer"
                onClick={() => setOpenOverview(false)}
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="p-3 border-b-[1px] border-black/30">
              <input
                type="text"
                name=""
                id=""
                className="bg-slate-100 border-[1px] rounded-sm border-black/20 py-1 px-2 w-full placeholder:px-2"
                placeholder="Search Vehicle..."
              />
            </div>
            <div className="flex justify-around font-extrabold items-center p-3 border-b-[1px] border-black/30 text-sm">
              <span className="cursor-pointer block">ALL</span>
              <span>DRIVING</span>
              <span>PARKED</span>
            </div>
            <div>
              <div className="flex items-center gap-4 p-4 border-b-[1px] border-black/30" onClick={() => setVehicleDetails(true)}>
                <div className=" border-black/20 rounded-full p-3 border-[1px] flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="size-8 fill-black/60"
                  >
                    <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Z" />
                    <path d="M8.25 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0ZM15.75 6.75a.75.75 0 0 0-.75.75v11.25c0 .087.015.17.042.248a3 3 0 0 1 5.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 0 0-3.732-10.104 1.837 1.837 0 0 0-1.47-.725H15.75Z" />
                    <path d="M19.5 19.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="capitalize font-extrabold text-xl">
                    T766 BDG
                  </span>
                  <div className="flex items-center  gap-1 1text-black/70 text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-4 fill-black/50"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Kevin Kijazi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {VehicleDetals ? (<div className="w-[350px] bg-white text-black">
            <div className="text-xl font-bold text-black border-b-[1px] border-black/30 p-3 flex items-center justify-between">
              <span>Trip Details</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6 cursor-pointer"
                onClick={() => setVehicleDetails(false)}
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="flex flex-col text-sm p-3 border-b-[1px] border-black/30">
              <span className="font-bold">T766 BDG</span>
              <span className="text-black/70 text-xs">
                1FVAF3CV84DM31815{" "}
                <span className="font-extrabold text-green-700 pl-4">
                  PACKED
                </span>
              </span>
            </div>
            <div className="grid grid-cols-2 py-5 px-3 gap-7 border-b-[1px] border-black/30">
              <div className="flex flex-col gap-2">
                <div className="flex gap-1 text-xs items-center text-black/60 font-bold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                    />
                  </svg>
                  <span>Start Date</span>
                </div>
                <span className="font-bold text-sm">May 14 / 10:35 AM</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-1 text-xs items-center text-black/60 font-bold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <span>Duration</span>
                </div>
                <span className="font-bold text-sm">38h</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-1 text-xs items-center text-black/60 font-bold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                    />
                  </svg>
                  <span>Distance Covered</span>
                </div>
                <span className="font-bold text-sm">13,000 km</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex gap-1 text-xs items-center text-black/60 font-bold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                  <span>Driver</span>
                </div>
                <span className="font-bold text-sm">Kevin Kijazi</span>
              </div>
            </div>
            <div className="p-3 flex justify-between gap-3 border-b-[1px] border-black/30">
              <div className="rounded-lg border-[1px] border-black/30 w-[50%] flex flex-col items-center justify-center gap-2 p-2">
                <div className="flex items-center gap-1 text-xs font-bold text-black/60">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                    />
                  </svg>
                  <span>Fuel Consumption</span>
                </div>
                <span className="uppercase font-bold text-sm">8 kpl</span>
              </div>
              <div className="rounded-lg border-[1px] border-black/30 w-[50%] flex flex-col items-center justify-center gap-2 p-2">
                <div className="flex items-center gap-1 text-xs font-bold text-black/60">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                    />
                  </svg>
                  <span>Average Speed</span>
                </div>
                <span className="uppercase font-bold text-sm">70 kph</span>
              </div>
            </div>
            <div className="px-3 flex flex-col">
              <div className="flex items-center gap-4 border-b-[1px] border-black/10 py-4">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-xs text-black/60 uppercase">
                    Departure
                  </span>
                  <span className="text-sm font-bold text-black">
                    Dar es Salaam, Tanzania
                  </span>
                  <span className="text-xs text-black/60">May 14, 4:00 PM</span>
                </div>
              </div>
              <div className="flex items-center gap-4 border-b-[1px] border-black/10 py-4">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-xs text-black/60 uppercase">
                    Departure
                  </span>
                  <span className="text-sm font-bold text-black">
                    Dar es Salaam, Tanzania
                  </span>
                  <span className="text-xs text-black/60">May 14, 4:00 PM</span>
                </div>
              </div>
              <div className="flex items-center gap-4 border-b-[1px] border-black/10 py-4">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-xs text-black/60 uppercase">
                    Departure
                  </span>
                  <span className="text-sm font-bold text-black">
                    Dar es Salaam, Tanzania
                  </span>
                  <span className="text-xs text-black/60">May 14, 4:00 PM</span>
                </div>
              </div>
              <div className="flex items-center gap-4 border-b-[1px] border-black/10 py-4">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-xs text-black/60 uppercase">
                    Departure
                  </span>
                  <span className="text-sm font-bold text-black">
                    Dar es Salaam, Tanzania
                  </span>
                  <span className="text-xs text-black/60">May 14, 4:00 PM</span>
                </div>
              </div>
            </div>
          </div>): null}
        </div>
      ) : null}
    </>
  );
};

export default SideOverview;
