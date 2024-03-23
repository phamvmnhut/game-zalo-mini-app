import React from "react";
import { Icon } from "zmp-ui";

export function NotFoundCard() {
  return (
    <div className="rounded-xl overflow-clip bg-primary/10 px-3 py-4 gap-1 flex flex-col justify-start items-center">
      <Icon icon="zi-note-delete" size={28} />
      <div className=" font-bold">Không có kết quả phù hợp</div>
    </div>
  )
}