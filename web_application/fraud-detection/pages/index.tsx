import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FormEventHandler, useRef } from "react";

const Home: NextPage = () => {
  
  const inputRef = useRef(null)
  
  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    console.log(e.target)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2 bg-primary">
      <Head>
        <title>Fraud Detector</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="h-5/6 p-12 sm:mx-10 card shadow-xl bg-white relative overflow-hidden">
        <div className="grid grid-cols-2 min-h-[70vh] max-w-7xl mx-auto">
          <div className="sm:text-center lg:text-left relative">
            <div className="bg-[url(logo.png)] bg-no-repeat bg-contain h-20 w-20"></div>

            <h1 className="text-4xl mt-5 tracking-wider font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="inline">Standard</span>
              <br />
              <span className="inline">Bank</span>{" "}
              <span className="text-white bg-primary rounded-lg px-3 xl:inline">
                CFD
              </span>
            </h1>

            <p className="mt-3 text-base text-gray-base sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              We are proud to tell you that your money is safe with us, and to
              make sure of this very fact we wanted to provide you with the tool
              to check for any suspicious activity for your account.
            </p>

            <div className="">
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <Link href="/transactions" className="w-1/2 flex shadow items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-focus">
                  😇 Take Me There
                </Link>
              </div>
            </div>
          </div>
          <div className="bg-[url(landing-card-graphic.svg)] bg-no-repeat bg-contain bg-center relative">
            <div className="h-11 w-11 bg-indigo-600 rounded-full absolute left-1/4"></div>
            <div className="h-5 w-5 bg-indigo-600 rounded-full absolute bottom-1/4"></div>
          </div>
        </div>

        <div className="h-10 w-10 bg-indigo-200 rounded-full absolute -left-2 -top-2"></div>
        <div className="h-40 w-40 bg-indigo-400 rounded-full absolute -right-10 -bottom-10"></div>
      </div>
    </div>
  );
};

export default Home;
