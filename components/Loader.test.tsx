import { render, screen } from "@testing-library/react";
import Loader from "./Loader";
import { vi } from "vitest";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe("Loader", () => {
  it("renders loading image", () => {
    render(<Loader />);
    const img = screen.getByAltText("Loading") as HTMLImageElement;

    expect(img).toBeInTheDocument();
    expect(img.src).toContain("/icons/loading-circle.svg");
    expect(img.width).toBe(50);
    expect(img.height).toBe(50);
  });
});
