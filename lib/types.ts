export type FieldType =
  | "text"
  | "date"
  | "select"
  | "radio"
  | "checkbox"
  | "number"
  | "group";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  apiEndpoint?: {
    dependsOn: string;
    endpoint: string;
    method: string;
  };
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
  };
  visibility?: {
    dependsOn: string;
    condition: "equals" | "notEquals" | "contains";
    value: string | boolean | number;
  };
  dynamicOptions?: {
    dependsOn: string;
    endpoint: string;
    method: string;
  };
  fields?: FormField[];
}

export interface FormGroup {
  id: string;
  label: string;
  type: "group";
  fields: FormField[];
}

export interface FormStructure {
  formId: string;
  title: string;
  fields: (FormField | FormGroup)[];
}

export interface FormValues {
  [key: string]:
    | string
    | number
    | boolean
    | Date
    | string[]
    | Record<string, unknown>;
}

export interface Application {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  data: FormValues;
}

export interface Column {
  id: string;
  label: string;
  accessor: string;
  isVisible: boolean;
}
