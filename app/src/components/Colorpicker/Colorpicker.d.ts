export interface ColorpickerProps {
  color?: string;
  onChange: (color: string) => void;
  id: string;
  withoutInput?: boolean
}
