import { within } from "@testing-library/react";

const toContainRoleNames = (
  container: HTMLElement,
  role: string,
  names: string[]
) => {
  let returnValue = {
    pass: true,
    message: () => "",
  };

  for (let name of names) {
    const element = within(container).queryByRole(role, {
      name: new RegExp(`${name}`),
    });

    if (!element) {
      returnValue = {
        pass: false,
        message: () => ` expected to find ${names} with role ${role}.`,
      };
    }
    return returnValue;
  }
  return returnValue;
};

export default toContainRoleNames
