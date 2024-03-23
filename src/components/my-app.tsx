import React, { Suspense } from "react";
import {
  AnimationRoutes,
  App,
  SnackbarProvider,
  Spinner,
  ZMPRouter,
} from "zmp-ui";
import { Route } from "react-router-dom";
import { HomePage } from "@pages/home/home";
import { ROUTES } from "@config";
import { Game } from "@pages/game/game";
import { AuthenticateProvider } from "./authenticate-provider";

export default function MyApp() {
  return (
    <App>
      <Suspense
        fallback={
          <div className="w-screen h-screen flex justify-center items-center">
            <Spinner />
          </div>
        }
      >
        <SnackbarProvider>
          <AuthenticateProvider>
            <ZMPRouter>
              <AnimationRoutes>
                <Route path={ROUTES.ROOT} element={<HomePage />} />
                <Route path={ROUTES.GAME + "/:id"} element={<Game />} />
              </AnimationRoutes>
            </ZMPRouter>
          </AuthenticateProvider>
        </SnackbarProvider>
      </Suspense>
    </App>
  );
}
