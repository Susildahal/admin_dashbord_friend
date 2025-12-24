import React, { useEffect, useState } from "react";
import client from "../../config/sanity";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import DeleteConfirmation from "@/common/DeleteConformatio";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Contact {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    message: string;
}
import { Trash2, Eye, MoreVertical } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

const ContactForm = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState<Contact | null>(null);
    const [form, setForm] = useState<Omit<Contact, '_id'> | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [viewing, setViewing] = useState<Contact | null>(null);

    const fetchContacts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await client.fetch(
                `*[_type == "contact"] | order(_createdAt desc) { _id, firstName, lastName, email, phoneNumber, message }`
            );
            setContacts(data);
        } catch (err: any) {
            setError("Failed to fetch contacts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await client.delete(id);
            setContacts((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            alert("Failed to delete contact");
        }
    };

    const confirmDelete = async (id: string) => {
        try {
            await client.delete(id);
            setContacts((prev) => prev.filter((c) => c._id !== id));
            setDeletingId(null);
        } catch (err) {
            alert("Failed to delete contact");
            setDeletingId(null);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Contact Submissions</h2>
           
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <Table>
                    <TableCaption>List of all contact submissions</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>First Name</TableHead>
                            <TableHead>Last Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {contacts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">No contacts found.</TableCell>
                            </TableRow>
                        ) : (
                            contacts.map((contact) => (
                                <TableRow key={contact._id}>
                                    <TableCell>{contact.firstName}</TableCell>
                                    <TableCell>{contact.lastName}</TableCell>
                                    <TableCell>{contact.email}</TableCell>
                                    <TableCell>{contact.phoneNumber}</TableCell>
                                    <TableCell>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                {contact.message.slice(0, 50)}
                                            </TooltipTrigger>
                                            <TooltipContent>{contact.message}</TooltipContent>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="">
                                                    <MoreVertical className="inline-block w-4 h-4 rotate-90" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                             
                                                <DropdownMenuItem onClick={() => setViewing(contact)}>
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setDeletingId(contact._id)}>
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <DeleteConfirmation
                                            isOpen={deletingId === contact._id}
                                            onClose={() => setDeletingId(null)}
                                            onConfirm={() => confirmDelete(contact._id)}
                                            itemName={`${contact.firstName} ${contact.lastName}`}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            )}
            <Dialog open={!!viewing} onOpenChange={(open) => { if (!open) setViewing(null); }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contact Details</DialogTitle>
                </DialogHeader>
                {viewing && (
                  <div className="space-y-2">
                    <div><strong>First Name:</strong> {viewing.firstName}</div>
                    <div><strong>Last Name:</strong> {viewing.lastName}</div>
                    <div><strong>Email:</strong> {viewing.email}</div>
                    <div><strong>Phone Number:</strong> {viewing.phoneNumber}</div>
                    <div><strong>Message:</strong> {viewing.message}</div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
        </div>
    );
};

export default ContactForm;
