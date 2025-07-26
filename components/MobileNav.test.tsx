import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MobileNav from "./MobileNav";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/constants";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

vi.mock("next/image", () => (props: any) => {
  return <img {...props} alt={props.alt || "mocked image"} />;
});

describe("MobileNav", () => {
  beforeEach(() => {
    const mockedPathname = vi.mocked(usePathname);
    mockedPathname.mockReturnValue("/");
  });

  it("renders hamburger icon and opens the sidebar on click", async () => {
    render(<MobileNav />);

    const hamburgerIcon = screen.getByAltText(/hamburger menu icon/i);
    expect(hamburgerIcon).toBeInTheDocument();

    fireEvent.click(hamburgerIcon);

    await waitFor(() => {
      const yoomText = screen.getByText(/Yoom/i);
      expect(yoomText).toBeInTheDocument();
    });

    sidebarLinks.forEach((link) => {
      expect(screen.getByText(link.label)).toBeInTheDocument();
    });
  });

  it("highlights the active link based on pathname", async () => {
    const mockedPathname = vite.mocked(usePathname);
    mockedPathname.mockReturnValue("/some-path");

    render(<MobileNav />);
    fireEvent.click(screen.getByAltText(/hamburger menu icon/i));

    await waitFor(() => {
      sidebarLinks.forEach((link) => {
        const linkElement = screen.getByText(link.label).closest("a");
        if (link.route === "/some-path") {
          expect(linkElement).toHaveClass("bg-blue-1");
        } else {
          expect(linkElement).not.toHaveClass("bg-blue-1");
        }
      });
    });
  });
});



        