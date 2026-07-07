'use client';

import { useState } from "react";
import { AboutSection } from "@/modules/customer-experience/components/AboutSection";
import { ContactSection } from "@/modules/customer-experience/components/ContactSection";
import { GalleryStrip } from "@/modules/customer-experience/components/GalleryStrip";
import { Hero } from "@/modules/customer-experience/components/Hero";
import { MenuPreview } from "@/modules/customer-experience/components/MenuPreview";
import { ReservationPanel } from "@/modules/customer-experience/components/ReservationPanel";
import { SiteHeader } from "@/modules/customer-experience/components/SiteHeader";
import { cafeProfile } from "@/modules/customer-experience/data/cafeProfile";

export default function Home() {
  return (
    <main>
      <SiteHeader cafe={cafeProfile} />
      <Hero cafe={cafeProfile} />
      <MenuPreview items={cafeProfile.featuredMenu} />
      <ReservationPanel slots={cafeProfile.availableSlots} />
      <GalleryStrip gallery={cafeProfile.gallery} />
      <AboutSection cafe={cafeProfile} />
      <ContactSection cafe={cafeProfile} />
    </main>
  );
}
