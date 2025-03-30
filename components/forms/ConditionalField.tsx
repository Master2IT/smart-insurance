import React from 'react';
import { FormField as FormFieldType, FormGroup, FormValues } from '@/lib/types';
import FormFieldComponent from './FormField';

interface ConditionalFieldProps {
    field: FormFieldType | FormGroup;
    formValues: FormValues;
    onChange: (id: string, value: any) => void;
    errors?: Record<string, string>;
}

const ConditionalField: React.FC<ConditionalFieldProps> = ({ field, formValues, onChange, errors }) => {
    const shouldDisplay = () => {
        if (!('visibility' in field) || !field.visibility) return true;

        const { dependsOn, condition, value } = field.visibility;
        const dependentValue = formValues[dependsOn];

        if (condition === 'equals') {
            return dependentValue === value;
        } else if (condition === 'notEquals') {
            return dependentValue !== value;
        } else if (condition === 'contains' && Array.isArray(dependentValue)) {
            return dependentValue.includes(value.toString());
        }

        return true;
    };

    if (!shouldDisplay()) {
        return null;
    }

    // If this is a group field, render its nested fields
    if (field.type === 'group' && 'fields' in field) {
        return (
            <div className="space-y-4 border my-4 p-4 rounded-md">
                <h3 className="text-lg font-medium">{field.label}</h3>
                <div className="space-y-4">
                    {field?.fields?.map((nestedField) => (
                        <ConditionalField
                            key={nestedField.id}
                            field={nestedField}
                            formValues={formValues}
                            onChange={onChange}
                            errors={errors}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="my-6 px-5">
            <FormFieldComponent
                field={field as FormFieldType}
                value={formValues[field.id]}
                onChange={onChange}
                error={errors?.[field.id]}
                form={formValues}
            />
        </div>
    );
};

export default ConditionalField;