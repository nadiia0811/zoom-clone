import { render, screen, fireEvent } from "@testing-library/react";
import MeetingCard from "./MeetingCard";
import { describe, it, vi, expect, beforeEach } from "vitest";
import { toast } from "sonner";


vi.mock("next/image", () => ({
  default: (props: any) => {
    const { src, alt, ...rest } = props;
    return <img src={src} alt={alt} {...rest} />;
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe("MeetingCard", () => {
  const baseProps = {
    icon: "/icons/upcoming.svg",
    title: "Team Standup",
    date: "July 23, 2025",
    handleClick: vi.fn(),
    link: "https://test-meeting-link.com",
    buttonText: "Join Now",
    buttonIcon1: "/icons/play.svg",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title and date correctly", () => {
    render(<MeetingCard {...baseProps} />);
    expect(screen.getByText("Team Standup")).toBeInTheDocument();
    expect(screen.getByText("July 23, 2025")).toBeInTheDocument();
  });

  it("calls handleClick when Join Now is clicked", () => {
    render(<MeetingCard {...baseProps} />);
    fireEvent.click(screen.getByText("Join Now"));
    expect(baseProps.handleClick).toHaveBeenCalled();
  });

  it("copies link and shows toast on Copy Link click", async () => {
    const writeTextMock = vi.fn();
    Object.assign(navigator, {
      clipboard: { writeText: writeTextMock },
    });

    render(<MeetingCard {...baseProps} />);
    fireEvent.click(screen.getByText("Copy Link"));

    expect(writeTextMock).toHaveBeenCalledWith("https://test-meeting-link.com");
    expect(toast.success).toHaveBeenCalledWith("Link copied");
  });

  it("does not render buttons for previous meetings", () => {
    render(<MeetingCard {...baseProps} isPreviousMeeting />);
    expect(screen.queryByText("Join Now")).not.toBeInTheDocument();
    expect(screen.queryByText("Copy Link")).not.toBeInTheDocument();
  });
});
