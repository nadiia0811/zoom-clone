import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MeetingRoom from "./MeetingRoom";
import { vi } from "vitest";

const mockUseCallCallingState = vi.fn();

const mockPush = vi.fn();
const mockUseRouter = vi.fn(() => ({ push: mockPush }));
const mockUseSearchParams = vi.fn(() => new URLSearchParams());


vi.mock("next/navigation", () => ({
  useRouter: mockUseRouter,
  useSearchParams: mockUseSearchParams,
}));


vi.mock("@stream-io/video-react-sdk", async () => {
  return {
    useCallStateHooks: () => ({
      useCallCallingState: mockUseCallCallingState,
    }),
    CallParticipantsList: () => <div data-testid="participants-list" />,
    CallingState: {
      JOINED: "JOINED",
      CONNECTING: "CONNECTING",
    },
  };
});

describe("MeetingRoom Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCallCallingState.mockReturnValue("JOINED");
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
  });

  test("renders heading", () => {
    render(<MeetingRoom />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });

  test("switches layouts", () => {
    const mockSetLayout = vi.fn();
    vi.spyOn(React, "useState").mockImplementationOnce((init) => [
      init,
      mockSetLayout,
    ]);

    render(<MeetingRoom />);
    fireEvent.click(screen.getByText("Grid"));

    expect(mockSetLayout).toHaveBeenCalledWith("Grid");
  });

  test("toggles participants visibility", () => {
    const mockSetShowParticipants = vi.fn();

    vi.spyOn(React, "useState")
      .mockImplementationOnce((init) => [init, vi.fn()])
      .mockImplementationOnce((init) => [init, mockSetShowParticipants]);

    render(<MeetingRoom />);
    const button = screen.getByRole("button", { name: /Users/i });

    fireEvent.click(button);
    expect(mockSetShowParticipants).toHaveBeenCalledWith(true);

    fireEvent.click(button);
    expect(mockSetShowParticipants).toHaveBeenCalledWith(false);
  });

  test("redirects to '/' when call ends and not in personal room", () => {
    render(<MeetingRoom />);
    const endCallButton = screen.getByRole("button", { name: /End Call/i });
    fireEvent.click(endCallButton);
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  test("hides end call button in personal room", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("personal=true"));
    render(<MeetingRoom />);
    expect(screen.queryByRole("button", { name: /End Call/i })).toBeNull();
  });

  test("shows loader when call is connecting", () => {
    mockUseCallCallingState.mockReturnValueOnce("CONNECTING");
    render(<MeetingRoom />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
