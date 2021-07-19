import React, {
  SelectHTMLAttributes,
  useRef,
  useState,
  useCallback,
} from "react";

import { IconBaseProps } from "react-icons";
import { FiAlertCircle } from "react-icons/fi";

import { Container, Error } from "../styles";

interface ISelectOptions {
  name: string;
  value: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  containerStyle?: React.CSSProperties;
  icon?: React.ComponentType<IconBaseProps>;
  error?: string;
  value: any;
  handleChange: (
    event: any,
    date?: Date | undefined,
    name?: string | undefined
  ) => void;
  selectOptions?: ISelectOptions[];
}

const Select: React.FC<SelectProps> = ({
  name,
  containerStyle = {},
  icon: Icon,
  error,
  value,
  handleChange,
  selectOptions = [],
  ...rest
}) => {
  const inputRef = useRef<HTMLSelectElement>(null);
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
      <select
        name={name}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        value={value}
        defaultValue={value}
        ref={inputRef}
        onChange={(e) => handleChange(e)}
        {...rest}
      >
        {selectOptions.length > 0 &&
          selectOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
      </select>

      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  );
};

export default Select;
