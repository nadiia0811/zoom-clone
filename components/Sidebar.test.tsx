import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Sidebar from "../components/Sidebar";
import { sidebarLinks } from "../constants";

const mockUsePathname = vi.fn(() => "/dashboard");

vi.mock("next/navigation", () => ({
  __esModule: true,
  usePathname: mockUsePathname,
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe("Sidebar component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUsePathname.mockReturnValue("/dashboard");
  });

  it("renders without crashing", () => {
    render(<Sidebar />);
    const links = screen.getAllByRole("link");
    expect(links.length).toBe(sidebarLinks.length);
  });

  it("renders all sidebar links with correct text and href", () => {
    render(<Sidebar />);
    sidebarLinks.forEach((link) => {
      const linkElement = screen.getByText(link.label);
      expect(linkElement).toBeInTheDocument();

      const anchor = linkElement.closest("a");
      expect(anchor).toHaveAttribute("href", link.route);
    });
  });

  it("renders images for each link with correct alt text and src", () => {
    render(<Sidebar />);
    sidebarLinks.forEach((link) => {
      const image = screen.getByAltText(link.label);
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", link.imgUrl);
    });
  });

  it("applies active class to the correct link based on pathname", () => {
    mockUsePathname.mockReturnValue("/profile");

    const { default: SidebarWithMockedPath } = require("../components/Sidebar");
    render(<SidebarWithMockedPath />);

    const activeLink = screen.getByText("Profile").closest("a");
    expect(activeLink).toHaveClass("bg-blue-1");
  });

  it("does not apply active class to non-active links", () => {
    render(<Sidebar />);
    sidebarLinks
      .filter((link) => link.route !== "/dashboard")
      .forEach((link) => {
        const linkElement = screen.getByText(link.label).closest("a");
        expect(linkElement).not.toHaveClass("bg-blue-1");
      });
  });
});
