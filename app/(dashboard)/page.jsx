import Cards from "@/components/Cards";
import MotivationCard from "@/components/MotivationCard";
import RandomQuestion from "@/components/RandomQuestion";
import Todo from "@/components/Todo";
import Calendar from "@/components/Calendar";
import Image from "next/image";
import React from "react";

const Dashboard = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <Cards
          title="MERN Stack"
          subtitle="React · Node · Express · MongoDB"
          path="/mern"
        />
        <Cards title="DSA" subtitle="Arrays, Strings, Trees, DP" path="/dsa" />
        <Cards
          title="HR"
          subtitle="Behavioral & managerial questions"
          path="/hr"
        />
        <Cards
          title="Theory"
          subtitle="OS, DBMS, Networks & more"
          path="/theorysubject"
        />
        <Cards title="Projects" subtitle="CarrerMind, Zora" path="/hr" />
      </div>

      {/* Motivation + Calendar Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 items-start">
        <div className="space-y-4">
          <MotivationCard />
          <RandomQuestion />
          <Todo />
        </div>

        <div className="space-y-4">
          <Calendar />
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-14">
            <Image
              src="/panda1.png"
              alt="Panda 1"
              width={140}
              height={140}
              className="object-contain rounded-lg hover:scale-110 transition-transform w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36"
            />
            <Image
              src="/panda2.avif"
              alt="Panda 2"
              width={140}
              height={140}
              className="object-contain rounded-lg hover:scale-110 transition-transform w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36"
            />
            <Image
              src="/panda3.png"
              alt="Panda 3"
              width={140}
              height={140}
              className="object-contain rounded-lg hover:scale-110 transition-transform w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
