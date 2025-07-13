"use client";

import React from "react";
import dayjs from "dayjs";
import MeetingTypeList from "@/components/MeetingTypeList";
import { Call } from "@stream-io/video-react-sdk";
import { useGetCalls } from "@/hooks/useGetCalls";

const HomeLayout = () => {
  const formattedDate = dayjs(Date.now()).format("dddd, MMMM D, YYYY");
  const time = dayjs().format("HH:mm A");
  const { upcomingCalls } = useGetCalls();

  const getNextUpcomingCall = (upcomingCalls: Call[]): Call | null => {
    const now = new Date();

    const sortedUpcoming = [...upcomingCalls].sort((a, b) => {
      const aTime = a.state.startsAt?.getTime() ?? Infinity;
      const bTime = b.state.startsAt?.getTime() ?? Infinity;
      return aTime - bTime;
    });

    return sortedUpcoming[0] ?? null;
  };

  const formatUpcomingCallDate = (date?: Date) => {
    return date ? dayjs(date).format("dddd, MMMM D, YYYY hh:mm A") : "";
  };
  const upcomingCall = getNextUpcomingCall(upcomingCalls);

  const upcomingMessage = upcomingCall
    ? formatUpcomingCallDate(upcomingCall.state.startsAt!)
    : "No Upcoming Meetings";

  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex flex-col h-full justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal">
            {upcomingMessage}
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg text-sky-1 font-medium lg:text-2xl">
              {formattedDate}
            </p>
          </div>
        </div>
      </div>
      <MeetingTypeList />
    </section>
  );
};

export default HomeLayout;
