'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchFormStructure } from '@/lib/api';
import DynamicForm from '@/components/forms/DynamicForm';
import { FormStructure } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ApplyPage() {
    const params = useParams();
    const router = useRouter();
    const [formStructure, setFormStructure] = useState<FormStructure | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const insuranceType = params.type as string;

    useEffect(() => {
        const loadFormStructure = async () => {
            setLoading(true);
            try {
                const data = await fetchFormStructure(insuranceType);
                setFormStructure(data);
                setError(null);
            } catch (err) {
                console.error('Error loading form structure:', err);
                setError('Failed to load the application form. Please try again later.');
                toast("Failed to load the application form. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (insuranceType) {
            loadFormStructure();
        }
    }, [insuranceType]);

    const getInsuranceTitle = (type: string) => {
        const titles: Record<string, string> = {
            health: 'Health Insurance',
            home: 'Home Insurance',
            car: 'Car Insurance',
            life: 'Life Insurance',
        };
        return titles[type] || 'Insurance';
    };

    return (
        <div className="container mx-auto py-8">
            <div className="mb-6">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">{getInsuranceTitle(insuranceType)} Application</h1>
                <p className="text-muted-foreground mt-2">
                    Please fill out the form below to apply for {getInsuranceTitle(insuranceType).toLowerCase()}
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p>Loading application form...</p>
                </div>
            ) : error ? (
                <div className="bg-destructive/10 p-4 rounded-md">
                    <p className="text-destructive">{error}</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => router.push('/')}
                    >
                        Return to Home
                    </Button>
                </div>
            ) : formStructure ? (
                <DynamicForm selectedFormId={insuranceType} formStructure={formStructure} />
            ) : null}
        </div>
    );
}