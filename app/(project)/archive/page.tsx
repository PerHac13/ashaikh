"use client";


"use client";
import Head from "next/head";

import { useEffect, useRef } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
 

  return (
    
      <>
      <Head>
        <style jsx global>{`
          body {
            font-family: "${inter.style.fontFamily}";
          }
        `}</style>
      </Head>
      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0">
        <div className="lg:flex lg:justify-center lg:gap-4">
          <main className="flex flex-col pt-6 lg:pt-24 lg:w-1/2 lg:py-24 gap-8 text-center text-4xl">
            Work In Progress
          </main>
        </div>
      </div>
    </>
  );
}