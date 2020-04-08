
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
  E_AT:"Already taken",
  E_BP:"Bad password"
}

export { Error, ErrorMessages,errorMsg };