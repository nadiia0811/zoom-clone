"use client";

import { FC, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import { useParams } from "next/navigation";
import MeetingSetup from "@/components/MeetingSetup";
import MeetingRoom from "@/components/MeetingRoom";
import { useGetCallById } from "@/hooks/getCallById";
import Loader from "@/components/Loader";

const Meeting: FC = () => {
  const { id } = useParams() as { id: string };

  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { isLoaded } = useUser();

  const { call, isCallLoading } = useGetCallById(id);

  if (isCallLoading || !isLoaded) {
    return <Loader />;
  }

  return (
    <main className="h-screen w-full text-white">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
