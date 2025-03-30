import React, { useState, useEffect } from 'react';
import { FormStructure, FormValues, FormField, FormGroup } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { submitForm } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import ConditionalField from './ConditionalField';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { ChevronDown } from 'lucide-react';

interface DynamicFormProps {
    formStructure: FormStructure[];
    initialValues?: FormValues;
    selectedFormId: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ formStructure, selectedFormId, initialValues = {} }) => {
    const [formValues, setFormValues] = useState<FormValues>(initialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const savedDraft = localStorage.getItem(`form_draft_${selectedFormId}`);
        if (savedDraft) {
            try {
                const parsedDraft = JSON.parse(savedDraft);
                setFormValues(parsedDraft);
                toast.success("Your previous progress has been restored.");
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        }
    }, [selectedFormId]);

    useEffect(() => {
        const saveTimeout = setTimeout(() => {
            if (Object.keys(formValues).length > 0 && selectedFormId) {
                localStorage.setItem(`form_draft_${selectedFormId}`, JSON.stringify(formValues));
            }
        }, 1000);

        return () => clearTimeout(saveTimeout);
    }, [formValues, selectedFormId]);

    const handleFieldChange = (id: string, value: string | number | boolean | string[] | Record<string, unknown> | Date) => {
        setFormValues((prev) => ({
            ...prev,
            [id]: value,
        }));

        // Clear error for this field if it exists
        if (errors[id]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    const isFieldVisible = (field: FormField) => {
        if (!field.visibility) return true;

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

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        // Helper function to validate fields recursively
        const validateFields = (fields: (FormField | FormGroup)[] | undefined) => {
            if (!fields) return;

            fields.forEach((field) => {
                // For group fields, validate their nested fields
                if (field.type === 'group' && 'fields' in field) {
                    if (field.fields) {
                        validateFields(field.fields);
                    }
                    return;
                }

                // Skip validation if field is not visible due to visibility conditions
                if (!isFieldVisible(field as FormField)) return;

                // Validate required fields
                if ('required' in field && field.required && (formValues[field.id] === undefined || formValues[field.id] === '')) {
                    newErrors[field.id] = `${field.label} is required`;
                    isValid = false;
                }

                // Validate pattern if provided
                if ('validation' in field && field.validation?.pattern && formValues[field.id]) {
                    const regex = new RegExp(field.validation.pattern);
                    if (!regex.test(String(formValues[field.id]))) {
                        newErrors[field.id] = `${field.label} has an invalid format`;
                        isValid = false;
                    }
                }

                // Validate min/max for numbers
                if (field.type === 'number' && formValues[field.id] !== undefined && 'validation' in field) {
                    const numValue = Number(formValues[field.id]);

                    if (field.validation?.min !== undefined && numValue < field.validation.min) {
                        newErrors[field.id] = `${field.label} must be at least ${field.validation.min}`;
                        isValid = false;
                    }

                    if (field.validation?.max !== undefined && numValue > field.validation.max) {
                        newErrors[field.id] = `${field.label} must be at most ${field.validation.max}`;
                        isValid = false;
                    }
                }

                // Validate minLength/maxLength for text
                if ((field.type === 'text') && formValues[field.id] && 'validation' in field) {
                    const strValue = String(formValues[field.id]);

                    if (field.validation?.minLength !== undefined && strValue.length < field.validation.minLength) {
                        newErrors[field.id] = `${field.label} must be at least ${field.validation.minLength} characters`;
                        isValid = false;
                    }

                    if (field.validation?.maxLength !== undefined && strValue.length > field.validation.maxLength) {
                        newErrors[field.id] = `${field.label} must be at most ${field.validation.maxLength} characters`;
                        isValid = false;
                    }
                }
            });
        };

        formStructure.map(f => validateFields(f.fields))

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form before submitting.");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = {
                formId: selectedFormId,
                data: formValues,
            };

            await submitForm(formData);

            // Clear the draft after successful submission
            localStorage.removeItem(`form_draft_${selectedFormId}`);

            toast.success("Your application has been submitted successfully.");

            // Redirect to applications page
            router.push('/applications');
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error("There was an error submitting your application. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formSchema = z.object({})

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    })

    if (!formStructure) {
        return <div>Loading form...</div>;
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                    {
                        formStructure.map(field => (
                            <Accordion key={field.formId} type="single" collapsible className="w-full border rounded-md">
                                <AccordionItem value={field.formId}>
                                    <AccordionTrigger className='p-2'>
                                        <Button variant="ghost" type='button'>
                                            <ChevronDown size={18} />
                                            {field.title}
                                        </Button>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {
                                            field.fields.map(_field => (
                                                <ConditionalField
                                                    key={_field.id}
                                                    field={_field}
                                                    formValues={formValues}
                                                    onChange={handleFieldChange}
                                                    errors={errors}
                                                />
                                            ))
                                        }
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        ))
                    }

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form >
    );
};

export default DynamicForm;