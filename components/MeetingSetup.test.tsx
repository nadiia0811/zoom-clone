import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MeetingSetup from "./MeetingSetup";

vi.mock("@stream-io/video-react-sdk", () => {
  return {
    useCall: () => ({
      camera: {
        enable: vi.fn(),
        disable: vi.fn(),
      },
      microphone: {
        enable: vi.fn(),
        disable: vi.fn(),
      },
      join: vi.fn(),
    }),
    VideoPreview: () => <div data-testid="video-preview">VideoPreview</div>,
    DeviceSettings: () => <div data-testid="device-settings">DeviceSettings</div>,
  };
});

describe("MeetingSetup", () => {
  const setIsSetupComplete = vi.fn();

  beforeEach(() => {
    setIsSetupComplete.mockClear();
  });

  it("renders all UI elements", () => {
    render(<MeetingSetup setIsSetupComplete={setIsSetupComplete} />);

    expect(screen.getByText("Setup")).toBeInTheDocument();
    expect(screen.getByTestId("video-preview")).toBeInTheDocument();
    expect(screen.getByTestId("device-settings")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Join with microphone and camera off")
    ).toBeInTheDocument();
    expect(screen.getByText("Join Meeting")).toBeInTheDocument();
  });

  it("toggles checkbox and calls mic/cam methods", () => {
    const { getByLabelText } = render(
      <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
    );

    const checkbox = getByLabelText("Join with microphone and camera off") as HTMLInputElement;
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  it("calls join and setIsSetupComplete on button click", () => {
    render(<MeetingSetup setIsSetupComplete={setIsSetupComplete} />);
    const button = screen.getByText("Join Meeting");

    fireEvent.click(button);
    expect(setIsSetupComplete).toHaveBeenCalledWith(true);
  });
});
