import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Navbar from "./Navbar";

vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => {
    return <a {...props}>{children}</a>;
  },
}));

vi.mock("./MobileNav", () => ({
  __esModule: true,
  default: () => <div>MobileNav</div>,
}));

vi.mock("@clerk/nextjs", () => ({
  __esModule: true,
  SignedIn: ({ children, ...props }: any) => (
    <div data-testid="signed-in">{children}</div>
  ),
  SignedOut: ({ children, ...props }: any) => (
    <div data-testid="signed-out">{children}</div>
  ),
  UserButton: () => <button data-testid="user-button">User Button</button>,
  SignInButton: () => <button data-testid="sign-in-button">Sign In</button>,
}));

describe("Navbar component", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("renders the logo image", () => {
    render(<Navbar />);
    const image = screen.getByAltText("Yoom logo");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/icons/logo.svg");
  });

  it("renders the appname", () => {
    render(<Navbar />);
    const appName = screen.getByText("Yoom");
    expect(appName).toBeInTheDocument();
  });

  it("renders UserButton when user signed in", () => {
    render(<Navbar />);
    expect(screen.getByTestId("user-button")).toBeInTheDocument();
  });

  it("renders SignInButton when signed out", async () => {
    vi.doMock("@clerk/nextjs", () => ({
      __esModule: true,
      SignedIn: () => null,
      SignedOut: ({ children }: any) => <>{children}</>,
      UserButton: () => <div>User Button</div>,
      SignInButton: () => <button data-testid="sign-in-button">Sign In</button>,
    }));

    const { default: NavbarSignedOut } = await import("./Navbar");

    render(<NavbarSignedOut />);
    expect(screen.getByTestId("sign-in-button")).toBeInTheDocument();
  });

  it("renders MobileNav", () => {
    render(<Navbar />);
    expect(screen.getByText("MobileNav")).toBeInTheDocument();
  });

  it("renders nav element", () => {
  render(<Navbar />);
  expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  vi.resetModules(); 
});
