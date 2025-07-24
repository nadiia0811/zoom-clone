import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MeetingTypeList from "./MeetingTypeList";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@clerk/nextjs", () => ({
  useUser: () => ({
    user: { id: "user1" },
  }),
}));

vi.mock("@stream-io/video-react-sdk", () => {
  return {
    useStreamVideoClient: () => ({
      call: vi.fn(() => ({
        id: "call-id",
        getOrCreate: vi.fn(() => Promise.resolve()),
      })),
    }),
    Call: class {},
  };
});

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("MeetingTypeList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all HomeCard buttons", () => {
    render(<MeetingTypeList />);

    expect(screen.getByText("New Meeting")).toBeInTheDocument();
    expect(screen.getByText("Schedule Meeting")).toBeInTheDocument();
    expect(screen.getByText("View Recordings")).toBeInTheDocument();
    expect(screen.getByText("Join Meeting")).toBeInTheDocument();
  });

  it("opens 'Start an Instant Meeting' modal on New Meeting click", () => {
    render(<MeetingTypeList />);
    fireEvent.click(screen.getByText("New Meeting"));
    expect(screen.getByText("Start an Instant Meeting")).toBeInTheDocument();
    expect(screen.getByText("Start Meeting")).toBeInTheDocument();
  });

  it("opens 'Create Meeting' modal on Schedule Meeting click", () => {
    render(<MeetingTypeList />);
    fireEvent.click(screen.getByText("Schedule Meeting"));
    expect(screen.getByText("Create Meeting")).toBeInTheDocument();
    expect(screen.getByText("Add a description")).toBeInTheDocument();
    expect(screen.getByText("Select date and time")).toBeInTheDocument();
  });

  it("calls createMeeting and shows success toast when Start Meeting clicked", async () => {
    render(<MeetingTypeList />);
    fireEvent.click(screen.getByText("New Meeting"));

    const startBtn = screen.getByText("Start Meeting");
    fireEvent.click(startBtn);

    await waitFor(() => {
      expect(require("sonner").toast.success).toHaveBeenCalledWith("Meeting Created");
    });
  });

  it("opens 'Type the link here' modal on Join Meeting click", () => {
    render(<MeetingTypeList />);
    fireEvent.click(screen.getByText("Join Meeting"));
    expect(screen.getByText("Type the link here")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Meeting link")).toBeInTheDocument();
  });

  it("navigates to entered link when Join Meeting button clicked", () => {
    const { useRouter } = require("next/navigation");
    const router = useRouter();

    render(<MeetingTypeList />);
    fireEvent.click(screen.getByText("Join Meeting"));

    const input = screen.getByPlaceholderText("Meeting link");
    fireEvent.change(input, { target: { value: "/meeting/test-link" } });

    fireEvent.click(screen.getByText("Join Meeting"));

    expect(router.push).toHaveBeenCalledWith("/meeting/test-link");
  });
});
