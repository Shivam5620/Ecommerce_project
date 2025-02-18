import SimpleReactValidator from "simple-react-validator";

export const getFormValidator = (options: any) => {
  const validator = new SimpleReactValidator({
    className: "text-danger mt-1",
    ...options,
    validators: {
      ...options.validators,
      password: {
        message: "Password does not match required criteria",
        rule: (val: any, params?: any): boolean => {
          return (
            validator.helpers.testRegex(
              val,
              /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i,
            ) && params.indexOf(val) === -1
          );
        },
      },
    },
  });
  return validator;
};
