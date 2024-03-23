import { LogoImgSrc, Slide1ImgSrc } from "@assets";
import React from "react";
import { Swiper } from "zmp-ui";

export function Advertising() {
  return (
    <div className="px-3 pt-5">
      <Swiper autoplay duration={2000} loop>
        <Swiper.Slide>
          <img
            className="slide-img aspect-video object-cover"
            src={Slide1ImgSrc}
            alt="slide-1"
          />
        </Swiper.Slide>
        <Swiper.Slide>
          <img className="slide-img aspect-video object-cover" src={LogoImgSrc} alt="slide-0" />
        </Swiper.Slide>
      </Swiper>
    </div>
  );
}
