import { type } from "os";
import React, {
  InputHTMLAttributes,
  useRef,
  useState,
  useCallback,
} from "react";
import DatePicker from "react-datepicker";
import { IconBaseProps } from "react-icons";
import { FiAlertCircle } from "react-icons/fi";

import { Container, Error } from "./styles";

interface ISelectOptions {
  name: string;
  value: string;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  containerStyle?: React.CSSProperties;
  icon?: React.ComponentType<IconBaseProps>;
  error?: string;
  value: any;
  type: string;
  handleChange: (
    event: any,
    date?: Date | undefined,
    name?: string | undefined
  ) => void;
  selectOptions?: ISelectOptions[];
}

const Input: React.FC<InputProps> = ({
  name,
  containerStyle = {},
  icon: Icon,
  error,
  value,
  type,
  handleChange,
  selectOptions = [],
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current?.value);
  }, []);

  return (
    <Container
      style={containerStyle}
      isErrored={!!error}
      isFocused={isFocused}
      isFilled={isFilled}
    >
      {Icon && <Icon size={20} />}
      {type === "date" ? (
        <DatePicker
          maxDate={new Date()}
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
          selected={new Date(value)}
          onChange={(date: Date, e) => {
            handleChange(e, date, name);
          }}
        />
      ) : (
        <input
          name={name}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          defaultValue={value}
          ref={inputRef}
          type={type}
          onChange={(e) => handleChange(e)}
          {...rest}
        />
      )}

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Input;
