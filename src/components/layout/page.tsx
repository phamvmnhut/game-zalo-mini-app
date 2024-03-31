import React from "react";

import { Icon, Page, useNavigate } from "zmp-ui";
import { PageProps } from "zmp-ui/page";

interface PropsType extends PageProps {
  title?: string;
  hiddenBackIcon?: boolean;
}

export function PageLayout({
  title,
  hiddenBackIcon,
  children,
  ...props
}: PropsType) {
  const navigate = useNavigate();

  return (
    <Page
      {...props}
      className={"flex flex-col gap-3 w-full relative" + props.className}
    >
      <div className="fixed top-0 z-50 w-screen h-header flex items-center">
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
      {children}
    </Page>
  );
}
