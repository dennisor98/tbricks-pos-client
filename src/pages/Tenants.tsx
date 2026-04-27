import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip } from '@mui/material';
import { Plus, Edit, Delete } from 'lucide-react';
import { Tenant } from '../types';
import { AuthService } from '../services/auth';

const Tenants: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [open, setOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = () => {
    try {
      const allTenants = AuthService.getAllTenants();
      setTenants(allTenants);
    } catch (error) {
      console.error('Error loading tenants:', error);
    }
  };

  const handleOpen = () => {
    setEditingTenant(null);
    setFormData({
      name: '',
      businessName: '',
      email: '',
      phone: '',
      address: ''
    });
    setOpen(true);
  };

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setFormData({
      name: tenant.name,
      businessName: tenant.businessName,
      email: tenant.email,
      phone: tenant.phone,
      address: tenant.address || ''
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTenant(null);
  };

  const handleSave = () => {
    if (editingTenant) {
      // Update existing tenant
      const updatedTenants = tenants.map(t =>
        t.id === editingTenant.id
          ? { ...t, ...formData }
          : t
      );
      localStorage.setItem('tenants', JSON.stringify(updatedTenants));
      setTenants(updatedTenants);
    } else {
      // Create new tenant
      try {
        const newTenant = AuthService.createTenant(formData);
        setTenants([...tenants, newTenant]);
      } catch (error) {
        console.error('Error creating tenant:', error);
        alert('Error creating tenant. Only super users can create tenants.');
      }
    }
    handleClose();
  };

  const handleDelete = (tenantId: string) => {
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      const updatedTenants = tenants.filter(t => t.id !== tenantId);
      localStorage.setItem('tenants', JSON.stringify(updatedTenants));
      setTenants(updatedTenants);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3">Tenant Management</Typography>
        <Button
          variant="contained"
          startIcon={<Plus />}
          onClick={handleOpen}
        >
          Add Tenant
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Business Name</TableCell>
              <TableCell>Contact Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell>{tenant.businessName}</TableCell>
                <TableCell>{tenant.name}</TableCell>
                <TableCell>{tenant.email}</TableCell>
                <TableCell>{tenant.phone}</TableCell>
                <TableCell>
                  <Chip
                    label={tenant.isActive ? 'Active' : 'Inactive'}
                    color={tenant.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(tenant.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(tenant)} size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(tenant.id)} size="small" color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {tenants.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="textSecondary">
                    No tenants found. Click "Add Tenant" to create one.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Contact Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Business Name"
              fullWidth
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              label="Phone"
              fullWidth
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <TextField
              label="Address"
              fullWidth
              multiline
              rows={2}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingTenant ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tenants;
