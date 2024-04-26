import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import placeholder from "./assets/Car-Getting-Gas--Streamline-Milano 3.svg";
import placeholder2 from "./assets/Business-Deal-3--Streamline-Milano.svg";
import { PiTimer } from "react-icons/pi";
import { MdAttachMoney } from "react-icons/md";
import { FaStar } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";

export default function Home() {
  const navigate = useNavigate();
  const [color, setColor] = useState(false);

  const changeColor = () => {
    if (window.scrollY >= 90) {
      setColor(true);
    } else {
      setColor(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeColor);
    return () => {
      window.removeEventListener("scroll", changeColor);
    };
  }, []);

  const getCookie = (name) => {
    const cookies = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`));

    return cookies ? cookies.split("=")[1] : null;
  };

  // Example: Get the value of the 'username' cookie
  const cookie = getCookie("connect.sid");
  console.log("cookie", cookie);

  return (
    <div className="flex flex-col min-h-screen w-screen bg-white text-[#2f2f28] relative font-inter">
      <div
        className={`text-start py-4 px-10 w-full flex flex-row items-center justify-between h-20 fixed top-0 bg-white ${
          color ? "border-b border-stone-300" : null
        }`}
      >
        <div className="flex flex-row gap-x-12 items-center">
          <h1
            className="font-alegreya font-bold text-3xl hover:cursor-pointer"
            onClick={() =>
              document
                .getElementById("hero")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Fuel4You
          </h1>
          <div className="flex flex-row gap-x-10 font-semibold">
            <p
              className="hover:underline hover:underline-offset-8 transition-all duration-500 ease-in-out hover:cursor-pointer"
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              About
            </p>
            <p
              className="hover:underline hover:underline-offset-8 transition-all duration-500 ease-in-out hover:cursor-pointer"
              onClick={() =>
                document
                  .getElementById("why")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Why Us
            </p>
            <p
              className="hover:underline hover:underline-offset-8 transition-all duration-500 ease-in-out hover:cursor-pointer"
              onClick={() =>
                document
                  .getElementById("how")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              How it works
            </p>
            <p
              className="hover:underline hover:underline-offset-8 transition-all duration-500 ease-in-out hover:cursor-pointer"
              onClick={() =>
                document
                  .getElementById("testimonials")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Testimonials
            </p>
          </div>
        </div>

        {cookie === null ? (
          <button
            className="bg-[#0b3721] py-2 px-12 text-white rounded-md hover:bg-[#3d7b52] transition-colors ease-in-out duration-500"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        ) : (
          <button
            className="text-[#0b3721] hover:text-[#3d7b52] transition-colors ease-in-out duration-500 font-bold flex flex-row items-center gap-x-4"
            onClick={() => navigate("/profile")}
          >
            <FaUser />
            <p>Account</p>
          </button>
        )}
      </div>

      <div
        className="w-full h-screen items-center justify-center flex p-32 bg-gradient-to-b from-white from-50% to-green-50"
        id="hero"
      >
        <div className="flex flex-row gap-x-20 items-center justify-center">
          <div className="w-1/2 flex flex-col gap-y-12 text-start">
            <h1 className="font-alegreya text-9xl text-bold">
              Ready, Set, <span className="italic">Fuel</span>
            </h1>
            <p className="w-3/4 text-xl">
              Getting a custom fuel quote has never been easier than with{" "}
              <span className="font-bold">Fuel4You</span>.
            </p>
          </div>
          <div className="w-1/2">
            <img
              src={placeholder}
              alt="car getting gas"
              className="size-full"
            ></img>
          </div>
        </div>
      </div>

      <div
        className="px-32 py-24 bg-[#061f13] text-[#fafafa] flex flex-row text-start gap-x-20"
        id="about"
      >
        <div className="w-1/3">
          <img src={placeholder2} alt="form" className="size-full"></img>
        </div>

        <div className="flex flex-col gap-y-12 w-full">
          <h1 className="font-alegreya text-5xl font-bold">About</h1>
          <p className="">
            Ever since 1999, Fuel4You has been the leading fuel provider for
            customers nationwide. Serving all 50 states, we have become
            America's favorite fuel provider and named the {""}
            <span className="font-bold">
              2023 Fuel Company of the Year
            </span> by {""}
            <span className="italic">
              The National Fuel Association of America{""}
            </span>
            . <br></br> <br></br>With Fuel4You, we make getting a custom fuel
            quote simple and hassle-free.
          </p>
        </div>
      </div>

      <div
        className="p-32 flex flex-col text-start gap-y-16 border-stone-200"
        id="why"
      >
        <h1 className="font-alegreya font-bold text-5xl">Why Us?</h1>

        <div className="flex flex-row gap-x-8">
          <div className="border-stone-300 bg-stone-50 p-10 border rounded-md w-1/3 gap-y-10 flex flex-col items-center">
            <div className="border-stone-200 border rounded-full p-2 self-start">
              <PiTimer size={25} />
            </div>
            <div className="flex flex-col gap-y-2">
              <h4 className="font-semibold text-xl self-start">Save Time</h4>
              <p>
                Our online fueling service allows you to avoid the need to
                travel to the gas station. Simply, enter your details and you'll
                get an instant quote in no time.
                <br></br>
                <br></br>Our online service even eliminates the possibility of
                fuel card fraud.
              </p>
            </div>
          </div>

          <div className="border-stone-300 bg-stone-50 p-10 border rounded-md w-1/3 gap-y-10 flex flex-col items-center">
            <div className="border-stone-200 border rounded-full p-2 self-start">
              <MdAttachMoney size={25} />
            </div>
            <div className="flex flex-col gap-y-2">
              <h4 className="font-semibold text-xl self-start">
                Get a Competitive Price
              </h4>
              <p>
                Fuel4You offers competitive fuel prices tailored for your
                demands that you won't find anywhere else.
                <br></br> <br></br>
                <span className="font-semibold">
                  Found a lower price elsewhere?
                </span>
                <br></br>
                Let us know and we'll match that price. The{" "}
                <span className="italic">
                  Fuel4You Price Match Guarantee
                </span>{" "}
                ensures that we won't be beat on price.
              </p>
            </div>
          </div>

          <div className="border-stone-300 bg-stone-50 p-10 border rounded-md w-1/3 gap-y-10 flex flex-col items-center">
            <div className="border-stone-200 border rounded-full p-2 self-start">
              <FaStar size={25} />
            </div>
            <div className="flex flex-col gap-y-2">
              <h4 className="font-semibold text-xl self-start">
                A name you can trust
              </h4>
              <p>
                As the leading fuel provider, you can always count on Fuel4You
                for your fuel needs. If you have any questions, we provide 24/7
                online support.
                <br></br> <br></br>
                <span className="font-semibold">Not satisifed?</span>
                <br></br>Let us now and we'll refund you, backed by our{" "}
                <span className="italic">Customer Satisfaction Guarantee</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="p-32 flex flex-col text-start gap-y-16 border-stone-300 bg-stone-50 border-t"
        id="how"
      >
        <h1 className="font-alegreya font-bold text-5xl">How it Works</h1>

        <div className="flex flex-row gap-x-8">
          <div className="bg-white p-10 border rounded-md w-1/3 gap-y-10 flex flex-col items-center">
            <p className="border-stone-200 border rounded-full px-4 py-2 self-start font-bold font-xl">
              1
            </p>
            <div className="flex flex-col gap-y-2">
              <h4 className="font-semibold text-xl self-start">
                Create an Account
              </h4>
              <p>
                To get started, you'll need to create an account and add your
                address information to help up give you an accurate quote
                estimate.
              </p>
            </div>
          </div>

          <div className="self-center">
            <FaArrowRight />
          </div>

          <div className="bg-white p-10 border rounded-md w-1/3 gap-y-10 flex flex-col items-center">
            <p className="border-stone-200 border rounded-full px-4 py-2 self-start font-bold font-xl">
              2
            </p>
            <div className="flex flex-col gap-y-2">
              <h4 className="font-semibold text-xl self-start">
                Fill out a Quick Form
              </h4>
              <p>
                Just a few more details about your specific needs to
                help us get the best quote for you.
              </p>
            </div>
          </div>

          <div className="self-center">
            <FaArrowRight />
          </div>

          <div className="bg-white p-10 border rounded-md w-1/3 gap-y-10 flex flex-col items-center">
            <div className="border-stone-200 border rounded-full p-2 self-start">
              <FaCheck size={25} />
            </div>
            <div className="flex flex-col gap-y-2">
              <h4 className="font-semibold text-xl self-start">
                Get your Quote!
              </h4>
              <p>
                As soon as you submit the form, you'll get an instant quote.
                <br></br>
                <br></br>Yes, it's as easy as that!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="p-32 flex flex-col text-start gap-y-16 border-t border-stone-200 bg-gradient-to-b from-[#fafafa] from-50% to-green-50"
        id="testimonials"
      >
        <h1 className="font-alegreya font-bold text-5xl">Testimonials</h1>

        <div className="flex flex-col gap-y-8">
          <div className="flex flex-row gap-x-8">
            <div className="border-stone-300 bg-white p-10 border rounded-md w-1/2 gap-y-10 flex flex-col items-center">
              <div className="flex flex-col gap-y-6">
                <p className="italic">
                  "I recently used Fuel4You for a fuel quote and I couldn't be
                  happier with the service I received. The process was quick and
                  simple, and I was able to get a competitive price for my fuel
                  needs. I highly recommend Fuel4You for anyone looking for a
                  hassle-free and efficient way to get a fuel quote.
                </p>
                <p className="font-bold">Jane Doe</p>
              </div>
            </div>
            <div className="border-stone-300 bg-white p-10 border rounded-md w-1/2 gap-y-10 flex flex-col items-center">
              <div className="flex flex-col gap-y-6">
                <p className="italic">
                  "I have been using Fuel4You for all my fuel needs and I must
                  say, I am thoroughly impressed. Not only do they offer an
                  affordable price, but their service is quick and efficient. I
                  no longer have to worry about spending a fortune on fuel,
                  thanks to Fuel4You. "
                </p>
                <p className="font-bold">John Doe</p>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-x-8">
            <div className="border-stone-300 bg-[#fafafa] p-10 border rounded-md w-1/2 gap-y-10 flex flex-col items-center">
              <div className="flex flex-col gap-y-6">
                <p className="italic">
                  "Their team is always ready to assist and provide the best
                  quotes for my needs. I highly recommend Fuel4You to anyone
                  looking for a reliable and cost-effective fuel solution. Thank
                  you Fuel4You for making my life easier!"
                </p>
                <p className="font-bold">Mike Doe</p>
              </div>
            </div>
            <div className="border-stone-300 bg-[#fafafa] p-10 border rounded-md w-1/2 gap-y-10 flex flex-col items-center">
              <div className="flex flex-col gap-y-6">
                <p className="italic">
                  "The process is so easy and fast, I can get a quote in just a
                  few clicks. Not only that, but their prices are always
                  competitive and I know I am getting the best deal possible.
                  Thank you Fuel4You for providing such a great service!""
                </p>
                <p className="font-bold">Dave Doe</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-32 py-12 bg-[#061f13] text-white text-start  flex flex-row justify-between">
        <div className="w-fit flex flex-col gap-y-4">
          <h1
            className="font-bold font-alegreya text-3xl hover:cursor-pointer"
            onClick={() =>
              document
                .getElementById("hero")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Fuel4You
          </h1>
          <h2>© Fuel4You, Inc. All rights reserved.</h2>
        </div>

        <div className="flex flex-row gap-x-4 w-1/2">
          <div className="w-1/2 flex flex-col gap-y-4">
            <div className="flex flex-col">
              <p>1111 Main St</p>
              <p>Houton, TX 12345</p>
            </div>
            <div className="flex flex-col">
              <p>(123)-456-7890</p>
              <p>fuel4u@mail.org</p>
            </div>
          </div>
          <div className="w-1/2 flex flex-col gap-y-2">
            <p
              className="hover:underline hover:underline-offset-8 transition-all duration-500 ease-in-out hover:cursor-pointer"
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              About
            </p>
            <p
              className="hover:underline hover:underline-offset-8 transition-all duration-500 ease-in-out hover:cursor-pointer"
              onClick={() =>
                document
                  .getElementById("why")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Why Us
            </p>
            <p
              className="hover:underline hover:underline-offset-8 transition-all duration-500 ease-in-out hover:cursor-pointer"
              onClick={() =>
                document
                  .getElementById("how")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              How it Works
            </p>
            <p
              className="hover:underline hover:underline-offset-8 transition-all duration-500 ease-in-out hover:cursor-pointer"
              onClick={() =>
                document
                  .getElementById("testimonials")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Testimonials
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
