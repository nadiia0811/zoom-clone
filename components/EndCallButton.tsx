"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const EndCallButton = () => {
  const call = useCall();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();
  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call?.state.createdBy.id; 
  const router = useRouter();

    if (!isMeetingOwner) {
        return null;
    }

  return (
    <Button onClick={async () => {
        await call.endCall();
        router.push("/");
    }}
      className="cursor-pointer bg-red-500 hover:bg-red-600 text-white"
    >
      End call for everyone
    </Button>
  );
};

export default EndCallButton;
