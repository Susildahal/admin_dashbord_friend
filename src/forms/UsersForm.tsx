"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik } from "formik";
import * as Yup from "yup";
import { Trash2, SquarePen, MoreVertical, Eye, EyeClosed, ChevronLeft, Download, FileDown } from "lucide-react";
import axiosInstance from "@/lib/axios";
import Header from "../common/Header"


const Page = () => {
  const [users, setUsers] = useState([]);
  const [editData, setEditData] = useState(null);
  const [details, setDetails] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [password, setPassword] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formMode, setFormMode] = useState("create"); // "create" or "edit"
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [click , setClick] = useState (false); 
  const [limit] = useState(10);

  // Fetch Users
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/users?page=${page}&limit=${limit}`);
      setUsers(response.data.data);
      setTotalItems(response.data?.pagination?.total || 0);
      setCurrentPage(response.data?.pagination?.page || 1);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // Create User Handler
  const handleCreate = async (values, { resetForm }) => {
    try {
      setLoading(true);
      await axiosInstance.post("/users/register", values);
      resetForm();
      setCreateOpen(false);
      setPreviewData(null);
      setPassword(false);
      fetchUsers(currentPage);
    } catch (error) {
      console.log("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };
//     if (loading && users.length === 0) {
//     return <div className='h-screen justify-center items-center flex '><Spinner /></div>
//   }

  // Update User Handler
  const handleUpdate = async (values) => {
    try {
      await axiosInstance.put(`/users/updateuser/${editData._id}`, values);
      setEditData(null);
      setPreviewData(null);
      setIsEditing(false);
      setPassword(false);
      fetchUsers(currentPage);
    } catch (error) {
      console.log("Error updating:", error);
    }
  };

  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is Required"),
    email: Yup.string().email().required("Email is Required"),
    role: Yup.string().required("Role is Required"),
    password: Yup.string().min(6, "Password must be at least 6 characters"),
    address: Yup.string().optional(),
    phone: Yup.string().optional(),
  });

  // Handle Status Toggle
  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axiosInstance.patch(`/users/updateuserstatus/${userId}`, { status: newStatus });
      fetchUsers(currentPage);
    } catch (error) {
      console.log("Error updating status:", error);
    }
  };

  // Download PDF
  const downloadPDF = async () => {
    try {
      setDownloading(true);
      
      // Dynamic import for Next.js compatibility
      const jsPDF = (await import('jspdf')).default;
      const autoTable = (await import('jspdf-autotable')).default;
      
      // Fetch all users for PDF
      const response = await axiosInstance.get('/users?limit=10000');
      const allUsers = response.data.data || [];

      if (allUsers.length === 0) {
        alert('No users found to download');
        setDownloading(false);
        return;
      }

      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.setTextColor(122, 94, 57);
      doc.text('Users Management Report', 14, 20);
      
      // Add metadata
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
      doc.text(`Total Users: ${allUsers.length}`, 14, 34);
      
      // Add separator line
      doc.setDrawColor(122, 94, 57);
      doc.setLineWidth(0.5);
      doc.line(14, 38, 196, 38);
      
      // Prepare table data
      const tableData = allUsers.map((user, index) => [
        index + 1,
        user.name || 'N/A',
        user.email || 'N/A',
        (user.role || 'user').toUpperCase(),
        user.status ? 'Active' : 'Inactive',
        user.address || 'N/A',
        user.phone || 'N/A',
        new Date(user.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      ]);
      
      // Use autoTable - jspdf-autotable extends jsPDF prototype
      autoTable(doc, {
        head: [['#', 'Name', 'Email', 'Role', 'Status', 'Address', 'Phone', 'Joined Date']],
        body: tableData,
        startY: 42,
        styles: { 
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
        },
        headStyles: { 
          fillColor: [122, 94, 57],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 10, halign: 'center' },
          1: { cellWidth: 25 },
          2: { cellWidth: 35 },
          3: { cellWidth: 15, halign: 'center' },
          4: { cellWidth: 20, halign: 'center' },
          5: { cellWidth: 30 },
          6: { cellWidth: 25 },
          7: { cellWidth: 25, halign: 'center' }
        },
        margin: { top: 42 },
      });
      
      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
      
      // Save PDF
      const fileName = `users-report-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      // Success feedback
      console.log(`PDF downloaded successfully! (${allUsers.length} users)`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Failed to generate PDF: ${error.message}. Please try again.`);
    } finally {
      setDownloading(false);
    }
  };

  // Download CSV
  const downloadCSV = async () => {
    try {
      setDownloading(true);
      // Fetch all users for CSV
      const response = await axiosInstance.get('/users?limit=10000');
      const allUsers = response.data.data || [];

      if (allUsers.length === 0) {
        alert('No users found to download');
        return;
      }

      // Prepare CSV headers
      const headers = ['#', 'Name', 'Email', 'Role', 'Status', 'Address', 'Phone', 'Created Date'];
      
      // Prepare CSV rows
      const rows = allUsers.map((user, index) => [
        index + 1,
        user.name || 'N/A',
        user.email || 'N/A',
        (user.role || 'user').toUpperCase(),
        user.status ? 'Active' : 'Inactive',
        user.address || 'N/A',
        user.phone || 'N/A',
        new Date(user.createdAt).toLocaleDateString('en-US')
      ]);
      
      // Convert to CSV format
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');
      
      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `users-export-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Success feedback
      alert(`CSV downloaded successfully! (${allUsers.length} users)`);
    } catch (error) {
      console.error('Error generating CSV:', error);
      alert('Failed to generate CSV. Please try again.');
    } finally {
      setDownloading(false);
    }
  };



  const PreviewModal = ({ data, onEdit, onConfirm, onCancel, isCreateMode }) => (
    <Dialog open={!!previewData} onOpenChange={onCancel}>
      <DialogContent className="p-6 max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isCreateMode ? "Preview New User" : "Preview Changes"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
              <div>
              <p className="text-sm text-gray-500">Image</p>
              <p className="text-base font-medium"> <img src={data?.profilePicture} alt={data?.name} className="h-10 w-10 rounded-full" /></p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-base font-medium">{data?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium">{data?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-base font-medium capitalize">{data?.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="text-base font-medium">{data?.address || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-base font-medium">{data?.phone || "N/A"}</p>
            </div>
            {data?.password && (
              <div>
                <p className="text-sm text-gray-500">Password</p>
                <p className="text-base font-medium">●●●●●●</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="outline" onClick={onEdit} className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Edit
          </Button>
          <Button disabled={loading} className ={loading ? "opacity-50 cursor-not-allowed" : ""} onClick={onConfirm}>
            {loading ? "Submitting..." : (isCreateMode ? "Create User" : "Save Changes")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
    {
      click && typeof click === "string" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-white/50" onClick={() => { setClick(false); }}>
          <div className="relative max-w-3xl max-h-full p-4 bg-transparent" onClick={e => e.stopPropagation()}>
            {/* Close (X) Button */}
            <button

              aria-label="Close"
              className="absolute top-4 right-5 text-white bg-black/60 hover:bg-black/80 rounded-full p-2 z-10"
              onClick={() => { setClick(false); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">

                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={click}
              alt="Enlarged Image"
              className="max-h-[80vh] w-auto rounded-md shadow-lg"
            />
          </div>
        </div>
      )

    }
      <Header
        title="User Management"
        titledesc="Manage all registered users and their roles"
        linkname="Create new user"
        link="#"
        onClickLink={() => {
          setCreateOpen(true);
          setFormMode("create");
          setIsEditing(false);
        }}
        additionalActions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                disabled={downloading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {downloading ? 'Downloading...' : 'Export Users'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={downloadPDF} disabled={downloading}>
                <Download className="mr-2 h-4 w-4" />
                Download as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadCSV} disabled={downloading}>
                <FileDown className="mr-2 h-4 w-4" />
                Download as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Index</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                <TableCell>
                  <img
                  onClick={() => setClick(user.profilePicture || "/default-profile.png")}
                    src={user.profilePicture || "/default-profile.png"}
                    alt={user.name}
                    className="h-10 w-10 rounded-full"
                  />
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Switch checked={user.status === true} onClick={() => handleStatusChange(user._id, !user.status)} />
                </TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="flex gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4 rotate-90" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setEditData(user);
                          setFormMode("edit");
                          setIsEditing(false);
                        }}
                      >
                        <SquarePen className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteId(user._id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDetails(user)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Create User Dialog */}
        <Dialog open={createOpen && !previewData} onOpenChange={() => {
          setCreateOpen(false);
          setPreviewData(null);
          setPassword(false);
        }}>
          <DialogContent className="p-4">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>

            <Formik
              initialValues={{
                name: "",
                email: "",
                role: "",
                address: "",
                phone: "",
                password: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => setPreviewData(values)}
            >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Name</label>
                    <Input
                      placeholder="Enter Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                    />
                    {typeof errors.name === 'string' && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Email</label>
                    <Input
                      placeholder="Enter Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                    />
                    {typeof errors.email === 'string' && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Role</label>
                    <Select
                      onValueChange={(value) =>
                        handleChange({ target: { name: "role", value } })
                      }
                      value={values.role}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {typeof errors.role === 'string' && (
                      <p className="text-red-500 text-sm">{errors.role}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Address</label>
                    <Input
                      placeholder="Enter Address"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Phone</label>
                    <Input
                      placeholder="Enter Phone"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="relative space-y-1">
                    <label className="block text-sm font-medium">Password</label>
                    <Input
                      placeholder="Enter Password"
                      type={password ? "text" : "password"}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-6 -translate-y-1/2 pt-4 text-gray-500"
                      onClick={() => setPassword(!password)}
                    >
                      {password ? (
                        <EyeClosed className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {errors.password && touched.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>

                  <Button className="mt-2 w-full" onClick={() => handleSubmit()}>
                    Preview
                  </Button>
                </div>
              )}
            </Formik>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={!!editData && !previewData && !isEditing} onOpenChange={() => {
          setEditData(null);
          setPreviewData(null);
          setPassword(false);
        }}>
          <DialogContent className="p-4">
            <DialogHeader>
              <DialogTitle>Update User Details</DialogTitle>
            </DialogHeader>

            <Formik
              initialValues={{
                name: editData?.name || "",
                email: editData?.email || "",
                role: editData?.role || "",
                address: editData?.address || "",
                phone: editData?.phone || "",
                profilePicture: editData?.profilePicture || "",
                password: "",
              }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={(values) => setPreviewData(values)}
            >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Name</label>
                    <Input
                      placeholder="Enter Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                    />
                    {typeof errors.name === 'string' && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Email</label>
                    <Input
                      placeholder="Enter Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                    />
                    {typeof errors.email === 'string' && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Role</label>
                    <Select
                      onValueChange={(value) =>
                        handleChange({ target: { name: "role", value } })
                      }
                      value={values.role}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {typeof errors.role === 'string' && (
                      <p className="text-red-500 text-sm">{errors.role}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Address</label>
                    <Input
                      placeholder="Enter Address"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Phone</label>
                    <Input
                      placeholder="Enter Phone"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="relative space-y-1">
                    <label className="block text-sm font-medium">
                      Password (optional)
                    </label>
                    <Input
                      placeholder="Enter Password"
                      type={password ? "text" : "password"}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-6 -translate-y-1/2 pt-4 text-gray-500"
                      onClick={() => setPassword(!password)}
                    >
                      {password ? (
                        <EyeClosed className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {errors.password && touched.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>

                  <Button className="mt-2 w-full" onClick={() => handleSubmit()}>
                    Preview
                  </Button>
                </div>
              )}
            </Formik>
          </DialogContent>
        </Dialog>

        {/* Preview Dialog - accessible from both create and edit */}
        {previewData && (
          <PreviewModal
            data={previewData}
            onEdit={() => {
              setIsEditing(true);
            }}
            onConfirm={() => {
              if (formMode === "create") {
                handleCreate(previewData, { resetForm: () => {} });
              } else {
                handleUpdate(previewData);
              }
            }}
            onCancel={() => {
              setPreviewData(null);
              setIsEditing(false);
            }}
            isCreateMode={formMode === "create"}
          />
        )}

        {/* Edit from Preview Dialog */}
        <Dialog open={isEditing && !!previewData} onOpenChange={() => setIsEditing(false)}>
          <DialogContent className="p-4">
            <DialogHeader>
              <DialogTitle>Edit User Details</DialogTitle>
            </DialogHeader>

            <Formik
              initialValues={{
                name: previewData?.name || "",
                email: previewData?.email || "",
                role: previewData?.role || "",
                address: previewData?.address || "",
                phone: previewData?.phone || "",
                password: previewData?.password || "",
              }}
              enableReinitialize
              validationSchema={validationSchema}
              onSubmit={(values) => setPreviewData(values)}
            >
              {({ values, errors, touched, handleChange, handleSubmit }) => (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Name</label>
                    <Input
                      placeholder="Enter Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                    />
                    {typeof errors.name === 'string' && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Email</label>
                    <Input
                      placeholder="Enter Email"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                    />
                    {typeof errors.email === 'string' && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Role</label>
                    <Select
                      onValueChange={(value) =>
                        handleChange({ target: { name: "role", value } })
                      }
                      value={values.role}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Address</label>
                    <Input
                      placeholder="Enter Address"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium">Phone</label>
                    <Input
                      placeholder="Enter Phone"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="relative space-y-1">
                    <label className="block text-sm font-medium">Password</label>
                    <Input
                      placeholder="Enter Password"
                      type={password ? "text" : "password"}
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-6 -translate-y-1/2 pt-4 text-gray-500"
                      onClick={() => setPassword(!password)}
                    >
                      {password ? (
                        <EyeClosed className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Back
                    </Button>
                    <Button onClick={() => handleSubmit()}>
                      Review Changes
                    </Button>
                  </div>
                </div>
              )}
            </Formik>
          </DialogContent>
        </Dialog>

        {/* View Details Dialog */}
        <Dialog open={!!details} onOpenChange={() => setDetails(null)}>
          <DialogContent className="p-4">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {details && (
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Image</p>
                  <p className="text-base font-medium">
                    <img
                      src={details.profilePicture || "/default-profile.png"}
                      alt={details.name}
                      className="h-10 w-10 rounded-full"
                    />
                  </p>
                </div>
                <p>
                  <strong>Name:</strong> {details.name}
                </p>
                <p>
                  <strong>Email:</strong> {details.email}
                </p>
                <p>
                  <strong>Role:</strong> {details.role}
                </p>
                <p>
                  <strong>Address:</strong> {details.address}
                </p>
                <p>
                  <strong>Phone:</strong> {details.phone}
                </p>
                <p>
                  <strong>Status:</strong> {details.status ? "Active" : "Inactive"}
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(details.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

      
      </div>
    </>
  );
};

export default Page;