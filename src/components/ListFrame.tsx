import React from "react";

interface ListFrameProps {
  horizontal?: boolean;
  children: React.ReactNode;
}

const ListFrame = ({
  horizontal = true,
  children,
}: ListFrameProps) => {
  return (
    <div className="px-4 pb-3">
      <div className="">
        <div
          className={`${
            horizontal
              ? "flex gap-3 overflow-x-auto desktop-scroll"
              : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6 mx-auto place-items-center w-full"
          } p-1 md:p-2 bg-transparent`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ListFrame;
