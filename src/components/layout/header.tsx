import React from "react";
import { Icon, useNavigate } from "zmp-ui";

interface PropsType {
  title?: string;
  hiddenBackIcon?: boolean;
}

export function Header({ title, hiddenBackIcon }: PropsType) {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-header flex items-center">
      <div className="flex items-center h-full pl-5 pr-header-r gap-3 w-full justify-between">
        <div className="flex flex-row items-center">
          {!hiddenBackIcon && (
            <span onClick={() => navigate(-1)}>
              <Icon icon="zi-chevron-left" className="w-4 h-4" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
