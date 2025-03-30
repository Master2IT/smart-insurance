import React, { useState, useEffect } from 'react';
import { Application, Column } from '@/lib/types';
import { fetchSubmissions } from '@/lib/api';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import ColumnSelector from './ColumnSelector';
import { toast } from 'sonner';

const ApplicationsTable: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [sortField, setSortField] = useState<string>('age');
    const [columns, setColumns] = useState<Column[]>([
        { id: 'fullName', label: 'Full Name', accessor: 'Full Name', isVisible: true },
        { id: 'age', label: 'Age', accessor: 'Age', isVisible: true },
        { id: 'gender', label: 'Gender', accessor: 'Gender', isVisible: true },
        { id: 'type', label: 'Insurance Type', accessor: 'Insurance Type', isVisible: true },
        { id: 'city', label: 'City', accessor: 'City', isVisible: true },
    ]);

    useEffect(() => {
        loadApplications();
    }, [currentPage, itemsPerPage, sortField, sortDirection]);

    const loadApplications = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: itemsPerPage,
                sort: sortField,
                order: sortDirection,
                search: searchTerm || undefined,
            };

            const response = await fetchSubmissions(params);
            setApplications(response.data);
            setTotalItems(response.data.length);
        } catch (error) {
            console.error('Error loading applications:', error);
            toast.error("Failed to load applications. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        loadApplications();
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleColumnChange = (columnId: string, isVisible: boolean) => {
        setColumns(columns.map(col =>
            col.id === columnId ? { ...col, isVisible } : col
        ));
    };

    const visibleColumns = columns.filter(col => col.isVisible);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const renderSortIcon = (field: string) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Insurance Applications</CardTitle>
                        <CardDescription>Manage your submitted insurance applications</CardDescription>
                    </div>
                    <ColumnSelector columns={columns} onColumnChange={handleColumnChange} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search applications..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-8"
                            />
                        </div>
                    </div>
                    <Button onClick={handleSearch}>Search</Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {visibleColumns.map((column) => (
                                    <TableHead key={column.id} className="cursor-pointer" onClick={() => handleSort(column.accessor)}>
                                        <div className="flex items-center space-x-1">
                                            <span>{column.label}</span>
                                            {renderSortIcon(column.accessor)}
                                        </div>
                                    </TableHead>
                                ))}
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length + 1} className="text-center py-8">
                                        Loading applications...
                                    </TableCell>
                                </TableRow>
                            ) : applications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length + 1} className="text-center py-8">
                                        No applications found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                applications.map((app) => (
                                    <TableRow key={app.id}>
                                        {visibleColumns.map((column) => (
                                            <TableCell key={`${app.id}-${column.id}`}>
                                                {column.accessor.includes('At')
                                                    ? formatDate(app[column.accessor as keyof Application] as string)
                                                    : app[column.accessor as keyof Application] as string}
                                            </TableCell>
                                        ))}
                                        <TableCell>
                                            <Button variant="outline" size="sm">View Details</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                        <p className="text-sm text-muted-foreground">
                            Showing {applications.length} of {totalItems} results
                        </p>
                        <Select
                            value={itemsPerPage.toString()}
                            onValueChange={(value) => {
                                setItemsPerPage(Number(value));
                                setCurrentPage(1);
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={itemsPerPage.toString()} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <div className="text-sm">
                            Page {currentPage} of {totalPages || 1}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage >= totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ApplicationsTable;