'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ApplicationsTable from '@/components/applications/ApplicationsTable';

export default function ApplicationsPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="mb-6">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">My Applications</h1>
                <p className="text-muted-foreground mt-2">
                    View and manage your insurance applications
                </p>
            </div>

            <ApplicationsTable />
        </div>
    );
}