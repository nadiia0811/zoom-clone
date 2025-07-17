import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import EndCallButton from "./EndCallButton";

const mockUseCall = vi.fn();
const mockUseLocalParticipant = vi.fn();

const mockPush = vi.fn();

vi.mock("@stream-io/video-react-sdk", () => ({
  useCall: () => mockUseCall(),
  useCallStateHooks: () => ({
    useLocalParticipant: () => mockUseLocalParticipant(),
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("EndCallButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders button only if user is meeting owner", () => {
    mockUseCall.mockReturnValue({
      state: { createdBy: { id: "owner-id" } },
      endCall: vi.fn(),
    });

    mockUseLocalParticipant.mockReturnValue({ userId: "owner-id" });

    render(<EndCallButton />);
    expect(screen.getByText("End call for everyone")).toBeInTheDocument();
  });

  test("does not render button if user is not meeting owner", () => {
    mockUseCall.mockReturnValue({
      state: { createdBy: { id: "owner-id" } },
      endCall: vi.fn(),
    });

    mockUseLocalParticipant.mockReturnValue({ userId: "another-user" });

    render(<EndCallButton />);
    expect(screen.queryByText("End call for everyone")).toBeNull();
  });

  test("clicking button calls endCall and navigates home", async () => {
    const mockEndCall = vi.fn().mockResolvedValue(undefined);

    mockUseCall.mockReturnValue({
      state: { createdBy: { id: "owner-id" } },
      endCall: mockEndCall,
    });

    mockUseLocalParticipant.mockReturnValue({ userId: "owner-id" });

    render(<EndCallButton />);

    fireEvent.click(screen.getByText("End call for everyone"));

    await waitFor(() => {
      expect(mockEndCall).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/");
    });
  });
});





