export interface InputProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  onEnterPress?: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  fullWidth?: boolean;
  containerClassName?: string;
  className?: string;
  height?: string; // h-10
  textarea?: boolean;
  rounded?: string | boolean;
  autoFocus?: boolean;
  icon?: React.ReactNode;
  id?: string;
  maxLength?: number;
  password?: boolean;
  passwordVisibility?: boolean;
  type?: HTMLInputElement["type"];
}
