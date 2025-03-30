'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { FormField as FormFieldType } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { fetchStates } from '@/lib/api';

interface FormFieldProps {
    field: FormFieldType;
    value: any;
    onChange: (id: string, value: any) => void;
    error?: string;
    form: any
}

const FormFieldComponent: React.FC<FormFieldProps> = ({ field, value, onChange, error, form }) => {
    const [options, setOptions] = useState<string[]>(field.options || []);
    const dependentFieldKey = field.dynamicOptions?.dependsOn || '';
    const dependentFieldValue = form[dependentFieldKey];
    const hasValidEndpoint = field.dynamicOptions?.endpoint;

    const fetchDynamicOptions = useCallback(async (dependentValue: string) => {
        if (!field.dynamicOptions?.endpoint) return;

        try {
            const response = await fetchStates(field.dynamicOptions.endpoint, { [dependentFieldKey]: dependentValue });
            setOptions(response.states);
        } catch (error) {
            console.error(`Error fetching options for field ${field.id}:`, error);
            setOptions([]);
        }
    }, [field.dynamicOptions?.endpoint, dependentFieldKey, field.id]);

    useEffect(() => {

        if (hasValidEndpoint && dependentFieldKey && dependentFieldValue) {
            fetchDynamicOptions(dependentFieldValue);
        }
    }, [dependentFieldValue, hasValidEndpoint, dependentFieldKey, fetchDynamicOptions]);

    const renderField = () => {
        switch (field.type) {
            case 'text':
                return (
                    <FormItem>
                        <FormLabel>{field.label}{field.required && '*'}</FormLabel>
                        <FormControl>
                            <Input
                                id={field.id}
                                placeholder={field.placeholder}
                                value={value || ''}
                                onChange={(e) => onChange(field.id, e.target.value)}
                            />
                        </FormControl>
                        {error && <FormMessage>{error}</FormMessage>}
                    </FormItem>
                );

            case 'select':
                return (
                    <FormItem>
                        <FormLabel>{field.label}{field.required && '*'}</FormLabel>
                        <Select
                            value={value || ''}
                            onValueChange={(val) => onChange(field.id, val)}
                        >
                            <FormControl>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={field?.placeholder || 'Select an option'} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    {options.map((option, i) => (
                                        <SelectItem key={i} value={option}>
                                            {option}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {error && <FormMessage>{error}</FormMessage>}
                    </FormItem>
                );

            case 'checkbox':
                return (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox
                                id={field.id}
                                checked={value || false}
                                onCheckedChange={(checked) => onChange(field.id, checked)}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel htmlFor={field.id}>{field.label}{field.required && '*'}</FormLabel>
                        </div>
                        {error && <FormMessage>{error}</FormMessage>}
                    </FormItem>
                );

            case 'radio':
                return (
                    <FormItem>
                        <FormLabel>{field.label}{field.required && '*'}</FormLabel>
                        <FormControl>
                            <RadioGroup
                                value={value || ''}
                                onValueChange={(val) => onChange(field.id, val)}
                            >
                                {options.map((option) => (
                                    <div key={option} className="flex items-center space-x-2">
                                        <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                                        <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </FormControl>
                        {error && <FormMessage>{error}</FormMessage>}
                    </FormItem>
                );

            case 'number':
                return (
                    <FormItem>
                        <FormLabel>{field.label}{field.required && '*'}</FormLabel>
                        <FormControl>
                            <Input
                                id={field.id}
                                type="number"
                                placeholder={field.placeholder}
                                value={value || ''}
                                onChange={(e) => onChange(field.id, e.target.value)}
                                min={field.validation?.min}
                                max={field.validation?.max}
                            />
                        </FormControl>
                        {error && <FormMessage>{error}</FormMessage>}
                    </FormItem>
                );

            case 'date':
                return (
                    <FormItem>
                        <FormLabel>{field.label}{field.required && '*'}</FormLabel>
                        <FormControl>
                            <Input
                                id={field.id}
                                type="date"
                                value={value || ''}
                                onChange={(e) => onChange(field.id, e.target.value)}
                            />
                        </FormControl>
                        {error && <FormMessage>{error}</FormMessage>}
                    </FormItem>
                );

            default:
                return <div>Unsupported field type: {field.type}</div>;
        }
    };

    return renderField();
};

export default FormFieldComponent;