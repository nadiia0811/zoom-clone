"use client";

import { useGetCalls } from "@/hooks/useGetCalls";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CallRecording, Call } from "@stream-io/video-react-sdk";
import MeetingCard from "./MeetingCard";
import Loader from "./Loader";
import { toast } from "sonner";

interface Props {
  type: "upcoming" | "ended" | "recordings";
}

const CallList = ({ type }: Props) => {
  const [recordings, setRecordings] = useState<CallRecording[]>([]);

  const { upcomingCalls, callRecordings, endedCalls, isLoading } = useGetCalls(); 
  const router = useRouter();

  const fetchRecordings = async () => {
    try {
      const callData = await Promise.all(
        callRecordings.map((meeting) => meeting.queryRecordings())
      );

      const recordingsList = callData
        .filter((call) => call.recordings.length > 0)
        .flatMap((call) => call.recordings);

      setRecordings(recordingsList);
    } catch (err) {
      toast.error("Failed to fetch recordings");
    }
  };

  useEffect(() => {
    if (type === "recordings") {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  const getNoCallsMessage = () => {
    switch (type) {
      case "ended":
        return "No Previous Calls";
      case "upcoming":
        return "No Upcoming Calls";
      case "recordings":
        return "No Recordings";
      default:
        return "";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "ended":
        return "/icons/previous.svg";
      case "upcoming":
        return "/icons/upcoming.svg";
      case "recordings":
        return "/icons/recordings.svg";
    }
  };

  const renderCall = (call: Call) => (
    <MeetingCard
      key={call.id}
      icon={getIcon()}
      title={call.state.custom.description?.substring(0, 30) || "No description"}
      date={call.state.startsAt?.toLocaleString() || "No date"}
      isPreviousMeeting={type === "ended"}
      buttonIcon1={undefined}
      buttonText="Start"
      link={`${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${call.id}`}
      handleClick={() => router.push(`/meeting/${call.id}`)}
    />
  );

  const renderRecording = (rec: CallRecording) => (
    <MeetingCard
      key={rec.session_id}
      icon={getIcon()}
      title={rec.filename || "Recording"}
      date={new Date(rec.start_time).toLocaleString()}
      isPreviousMeeting={false}
      buttonIcon1="/icons/play.svg"
      buttonText="Play"
      link={rec.url}
      handleClick={() => router.push(`${rec.url}`)}
    />
  );

  if (isLoading) return <Loader />;

  const noCallsMessage = getNoCallsMessage();

  const dataToRender = type === "recordings"
    ? recordings
    : type === "upcoming"
    ? upcomingCalls
    : endedCalls;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
      {dataToRender && dataToRender.length > 0 ? (
        dataToRender.map((item) =>
          type === "recordings"
            ? renderRecording(item as CallRecording)
            : renderCall(item as Call)
        )
      ) : (
        <h1>{noCallsMessage}</h1>
      )}
    </div>
  );
};

export default CallList;
