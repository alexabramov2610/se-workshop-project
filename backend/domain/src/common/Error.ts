interface Error {
  message: string;
  options?: any;
}

const ErrorMessages = {
  regiserError: "Registration Failed",
};

interface ErrorMessages {
  [key: string]:string;
}

const errorMsg:ErrorMessages = {
  E_NF: "Not found",
  E_CON: "Connection failed",
  E_AL: "Already at this state",
}

export { Error, ErrorMessages,errorMsg };
