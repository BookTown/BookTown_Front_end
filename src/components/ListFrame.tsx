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
      <div className="flex justify-center">
        <div
          className={`${
            horizontal
              ? "flex gap-3 overflow-x-auto desktop-scroll"
              : "grid grid-cols-2 gap-x-4 gap-y-6 place-items-center w-full max-w-screen-md"
          } p-1 md:p-2 bg-transparent`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ListFrame;
