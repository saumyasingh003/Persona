import Cards from "@/components/Cards";
import React from "react";

const theorysubject = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      
      <Cards
        title="OOPS"
        subtitle="Classes, Inheritance, Polymorphism"
        path="/theorysubject/oops"
      />

      <Cards
        title="DBMS"
        subtitle="Keys, Normalization, Transactions"
        path="/theorysubject/dbms"
      />

      <Cards
        title="System Design"
        subtitle="Scalability, APIs, Architecture"
        path="/theorysubject/system-design"
      />

      <Cards
        title="Computer Networks"
        subtitle="OSI, TCP/IP, HTTP, DNS"
        path="/theorysubject/computer-networks"
      />

    </div>
  );
};

export default theorysubject;
