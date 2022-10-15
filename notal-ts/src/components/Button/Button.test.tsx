import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a button", () => {
    render(<Button data-testid="button" />);

    const button = screen.getByTestId("button");

    expect(button).toBeInTheDocument();
  });
});
