import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import HomeCard from "./HomeCard";

describe("HomeCard component", () => {
  const mockHandleClick = vi.fn();

  const defaultProps = {
    title: "Test title",
    img: "/test-img.png",
    description: "test description text",
    handleClick: mockHandleClick,
    className: "custom-class",
  };

  it("renders title, description and image correctly", () => {
    render(<HomeCard {...defaultProps} />);

    expect(screen.getByText("Test title")).toBeInTheDocument();
    expect(screen.getByText("test description text")).toBeInTheDocument();

    const img = screen.getByAltText("meeting icon") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/test-img.png");
  });

  it("applies given className to the root div", () => {
    const { container } = render(<HomeCard {...defaultProps} />);

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("calls handleClick when the card is clicked", () => {
    render(<HomeCard {...defaultProps} />);

    fireEvent.click(screen.getByText("Test title").closest("div")!);
    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });
});
