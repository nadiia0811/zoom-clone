import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import MeetingModal from "@/components/MeetingModal";
import "@testing-library/jest-dom";

describe("MeetingModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: "Test Meeting",
    buttonText: "Click me",
    handleClick: vi.fn(),
  };

  it("renders title and button text", () => {
    render(<MeetingModal {...defaultProps} />);

    expect(screen.getByText("Test Meeting")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("calls handleClick when button is clicked", () => {
    render(<MeetingModal {...defaultProps} />);

    const button = screen.getByRole("button", { name: /click me/i });
    fireEvent.click(button);

    expect(defaultProps.handleClick).toHaveBeenCalled();
  });

  it("renders custom image when passed", () => {
    render(<MeetingModal {...defaultProps} image="/icons/test.svg" />);

    const image = screen.getByAltText("image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", expect.stringContaining("test.svg"));
  });

  it("does not render if isOpen is false", () => {
    render(<MeetingModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Test Meeting")).not.toBeInTheDocument();
  });

  it("renders children content", () => {
    render(
      <MeetingModal {...defaultProps}>
        <div>Child content</div>
      </MeetingModal>
    );

    expect(screen.getByText("Child content")).toBeInTheDocument();
  });
});
