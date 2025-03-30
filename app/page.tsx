import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const insuranceTypes = [
    { id: 'health', name: 'Health Insurance', description: 'Medical coverage for individuals and families' },
    { id: 'home', name: 'Home Insurance', description: 'Protection for your property and belongings' },
    { id: 'car', name: 'Car Insurance', description: 'Coverage for your vehicles against damage and accidents' },
    { id: 'life', name: 'Life Insurance', description: 'Financial security for your loved ones' },
  ];

  return (
    <main className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Smart Insurance Application Portal</h1>
        <p className="text-xl text-muted-foreground mt-4">
          Apply for insurance policies with our smart, dynamic application process
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insuranceTypes.map((type) => (
          <Card key={type.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{type.name}</CardTitle>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                Our {type.name.toLowerCase()} provides comprehensive coverage tailored to your specific needs.
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/apply/${type.id}`} className="w-full">
                <Button className="w-full">Apply Now</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/applications">
          <Button variant="outline">View My Applications</Button>
        </Link>
      </div>
    </main>
  );
}
