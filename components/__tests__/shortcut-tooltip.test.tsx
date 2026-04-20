import { render, screen } from "@testing-library/react";
import { ShortcutTooltip } from "../shortcut-tooltip";
import { describe, it, expect } from "vitest";

describe("ShortcutTooltip", () => {
  it("renders children correctly", () => {
    render(
      <ShortcutTooltip shortcut="SPACE">
        <button>Click me</button>
      </ShortcutTooltip>
    );
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("renders simple shortcut correctly", () => {
    render(
      <ShortcutTooltip shortcut="M">
        <div>Content</div>
      </ShortcutTooltip>
    );
    expect(screen.getByText("M")).toBeInTheDocument();
  });

  it("maps arrow keys to symbols", () => {
    const { rerender } = render(
      <ShortcutTooltip shortcut="UP">
        <div>Content</div>
      </ShortcutTooltip>
    );
    expect(screen.getByText("↑")).toBeInTheDocument();

    rerender(
      <ShortcutTooltip shortcut="DOWN">
        <div>Content</div>
      </ShortcutTooltip>
    );
    expect(screen.getByText("↓")).toBeInTheDocument();

    rerender(
      <ShortcutTooltip shortcut="LEFT">
        <div>Content</div>
      </ShortcutTooltip>
    );
    expect(screen.getByText("←")).toBeInTheDocument();

    rerender(
      <ShortcutTooltip shortcut="RIGHT">
        <div>Content</div>
      </ShortcutTooltip>
    );
    expect(screen.getByText("→")).toBeInTheDocument();
  });

  it('handles shortcuts with " / " separator', () => {
    render(
      <ShortcutTooltip shortcut="UP / DOWN">
        <div>Content</div>
      </ShortcutTooltip>
    );
    expect(screen.getByText("↑")).toBeInTheDocument();
    expect(screen.getByText("/")).toBeInTheDocument();
    expect(screen.getByText("↓")).toBeInTheDocument();
  });

  it('handles shortcuts with " + " separator', () => {
    render(
      <ShortcutTooltip shortcut="CMD + K">
        <div>Content</div>
      </ShortcutTooltip>
    );
    expect(screen.getByText("CMD")).toBeInTheDocument();
    expect(screen.getByText("+")).toBeInTheDocument();
    expect(screen.getByText("K")).toBeInTheDocument();
  });

  it("applies correct position classes", () => {
    const { container: topContainer } = render(
      <ShortcutTooltip shortcut="M" position="top">
        <div>Content</div>
      </ShortcutTooltip>
    );
    const topTooltip = topContainer.querySelector(".group > div:last-child");
    expect(topTooltip).toHaveClass("-top-11");

    const { container: bottomContainer } = render(
      <ShortcutTooltip shortcut="M" position="bottom">
        <div>Content</div>
      </ShortcutTooltip>
    );
    const bottomTooltip = bottomContainer.querySelector(".group > div:last-child");
    expect(bottomTooltip).toHaveClass("-bottom-11");

    const { container: leftContainer } = render(
      <ShortcutTooltip shortcut="M" position="left">
        <div>Content</div>
      </ShortcutTooltip>
    );
    const leftTooltip = leftContainer.querySelector(".group > div:last-child");
    expect(leftTooltip).toHaveClass("-left-16");

    const { container: rightContainer } = render(
      <ShortcutTooltip shortcut="M" position="right">
        <div>Content</div>
      </ShortcutTooltip>
    );
    const rightTooltip = rightContainer.querySelector(".group > div:last-child");
    expect(rightTooltip).toHaveClass("-right-16");
  });

  it("has opacity-0 by default and group-hover:opacity-100", () => {
    const { container } = render(
      <ShortcutTooltip shortcut="M">
        <div>Content</div>
      </ShortcutTooltip>
    );
    const tooltip = container.querySelector(".group > div:last-child");
    expect(tooltip).toHaveClass("opacity-0");
    expect(tooltip).toHaveClass("group-hover:opacity-100");
  });
});
