import { within } from "@testing-library/react";

const toContainRole = (container: HTMLElement, role: string, quantity = 1) => {
  const elements = within(container).queryAllByRole(role);

  if (elements.length === quantity) {
    return { pass: true, message: () => "success." };
  }

  return {
    pass: false,
    message: () =>
      `expected to find ${quantity} ${role} elements. Found ${elements.length}`,
  };
};

export default toContainRole;
