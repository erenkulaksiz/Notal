interface Options {
  id?: string;
  disabled?: boolean;
  text?: string;
}

export interface SelectProps {
  options: Options[];
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  className?: string;
  id?: string;
}
