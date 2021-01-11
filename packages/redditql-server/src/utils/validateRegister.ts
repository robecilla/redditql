import { UsernamePasswordInput } from "../resolvers/user";

export const validateRegister = ({
  email,
  username,
  password,
}: UsernamePasswordInput) => {
  if (!email.includes("@")) {
    return [
      {
        field: "email",
        message: "invalid email",
      },
    ];
  }

  if (username.includes("@")) {
    return [
      {
        field: "username",
        message: "username can not be an email",
      },
    ];
  }

  if (username.length <= 2) {
    return [
      {
        field: "username",
        message: "needs to be longer than 2 characters",
      },
    ];
  }

  if (password.length <= 3) {
    return [
      {
        field: "password",
        message: "needs to be longer than 3 characters",
      },
    ];
  }

  return null;
};
