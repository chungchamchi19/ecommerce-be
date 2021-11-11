import codes from "./codes";

const getErrorMessage = (code: number) => {
  switch (code) {
    case codes.NOT_FOUND:
      return "Request not found";
    case codes.FORBIDDEN:
      return "Not allowed";
    case codes.BAD_REQUEST:
      return "Bad Request";
    case codes.UNAUTHORIZED:
      return "Unauthorized";
    case codes.TOO_MANY_REQUESTS:
      return "Too many requests";
    case codes.INTERNAL_SERVER_ERROR:
      return "Something went wrong";
    case codes.DUPLICATE:
      return "Duplicate";
    default:
      return null;
  }
};

export default getErrorMessage;
