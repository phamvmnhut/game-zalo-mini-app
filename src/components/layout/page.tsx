import React from "react";

import { getConfig } from "@config";
import { Page, useNavigate, useSnackbar } from "zmp-ui";
import { PageProps } from "zmp-ui/page";

import { BackIcon } from "@components/icons/back";

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
  const { openSnackbar } = useSnackbar();

  return (
    <Page
      {...props}
      className={"flex flex-col gap-3 w-full relative" + props.className}
    >
      <div className="fixed top-0 z-50 w-screen h-header flex items-center bg-primary">
        <div className="flex items-center h-full pl-5 pr-header-r gap-3 w-full justify-between">
          <div className="flex flex-row items-center">
            {!hiddenBackIcon && (
              <span onClick={() => navigate(-1)}>
                <BackIcon className="w-4 h-4" />
              </span>
            )}
            <div className="pl-2 text-white font-normal">
              {title || getConfig<string>((e) => e.app.title)}
            </div>
          </div>
        </div>
      </div>
      {children}
    </Page>
  );
}
