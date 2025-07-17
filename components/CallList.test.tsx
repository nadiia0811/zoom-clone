import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import CallList from "./CallList";
import { Call, CallRecording } from "@stream-io/video-react-sdk";
import { toast } from "sonner";
import { useGetCalls } from "@/hooks/useGetCalls";

vi.mock("@/hooks/useGetCalls", () => ({
  useGetCalls: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockUseGetCalls = vi.mocked(useGetCalls);

describe("CallList component", () => {
  test("renders upcoming calls", () => {
    const mockCall = {
      id: "call1",
      type: "call",
      cid: "cid_1",
      state: {
        custom: { description: "Upcoming meeting 1" },
        startsAt: new Date("2025-01-01T12:00:00Z"),
      },
    } as unknown as Call;

    mockUseGetCalls.mockReturnValueOnce({
      upcomingCalls: [mockCall],
      callRecordings: [],
      endedCalls: [],
      isLoading: false,
    });

    render(<CallList type="upcoming" />);
    expect(screen.getByText(/Upcoming meeting 1/)).toBeInTheDocument();
  });
});

describe("CallList - Recordings", () => {
  test("fetches and displays recordings", async () => {
    const mockRecording: CallRecording = {
      session_id: "1",
      filename: "Recording 1",
      start_time: "2025-01-01T10:00:00Z",
      url: "/recordings/1",
    } as CallRecording;

    const mockCallWithQuery = {
      id: "call2",
      type: "call",
      cid: "cid_2",
      state: {},
      queryRecordings: vi.fn().mockResolvedValue({
        recordings: [mockRecording],
      }),
    } as unknown as Call;

    mockUseGetCalls.mockReturnValueOnce({
      upcomingCalls: [],
      callRecordings: [mockCallWithQuery],
      endedCalls: [],
      isLoading: false,
    });

    render(<CallList type="recordings" />);

    const recordingElement = await screen.findByText("Recording 1");
    expect(recordingElement).toBeInTheDocument();
  });

  test("shows error if fetching recordings fails", async () => {
    const mockQuery = vi.fn().mockRejectedValue(new Error("fetch failed"));

    const mockCallWithFailingQuery = {
      id: "call3",
      type: "call",
      cid: "cid_3",
      state: {},
      queryRecordings: mockQuery,
    } as unknown as Call;

    mockUseGetCalls.mockReturnValueOnce({
      upcomingCalls: [],
      callRecordings: [mockCallWithFailingQuery],
      endedCalls: [],
      isLoading: false,
    });

    render(<CallList type="recordings" />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to fetch recordings");
    });
  });
});
