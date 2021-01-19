import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import React, { ElementType, InputHTMLAttributes } from "react";
import { useField } from "formik";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  textarea?: boolean;
};

const InputField: React.FC<Props> = ({
  label,
  textarea,
  size: _,
  ...props
}) => {
  const [field, { error, touched }] = useField(props);
  const Component = textarea ? Textarea : (Input as ElementType);
  return (
    <FormControl isInvalid={error && touched}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <Component {...field} {...props} id={field.name} />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default InputField;
