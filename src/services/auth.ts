import { User, Tenant } from '../types';

const SUPER_USER_CREDENTIALS = {
  username: 'admin',
  email: 'admin@pos-system.com',
  password: 'admin123' // In production, this should be hashed
};

export const AuthService = {
  // Initialize super user on app boot
  initializeSuperUser: (): void => {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const superUserExists = existingUsers.some((user: User) => user.role === 'super_user');
    
    if (!superUserExists) {
      const superUser: User = {
        id: 'su-001',
        username: SUPER_USER_CREDENTIALS.username,
        email: SUPER_USER_CREDENTIALS.email,
        password: SUPER_USER_CREDENTIALS.password,
        role: 'super_user',
        createdAt: new Date().toISOString()
      };
      
      existingUsers.push(superUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));
      console.log('Super user created:', superUser.username);
    }
  },

  // Login user
  login: (username: string, password: string): User | null => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.username === username && u.password === password);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    return null;
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem('currentUser');
  },

  // Get current logged in user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return localStorage.getItem('currentUser') !== null;
  },

  // Check if user is super user
  isSuperUser: (): boolean => {
    const user = AuthService.getCurrentUser();
    return user?.role === 'super_user';
  },

  // Create tenant (only for super user)
  createTenant: (tenantData: Omit<Tenant, 'id' | 'createdAt' | 'isActive'>): Tenant => {
    const currentUser = AuthService.getCurrentUser();
    
    if (currentUser?.role !== 'super_user') {
      throw new Error('Only super user can create tenants');
    }
    
    const existingTenants = JSON.parse(localStorage.getItem('tenants') || '[]');
    
    const newTenant: Tenant = {
      ...tenantData,
      id: `tenant-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    existingTenants.push(newTenant);
    localStorage.setItem('tenants', JSON.stringify(existingTenants));
    
    return newTenant;
  },

  // Get all tenants (only for super user)
  getAllTenants: (): Tenant[] => {
    const currentUser = AuthService.getCurrentUser();
    
    if (currentUser?.role !== 'super_user') {
      throw new Error('Only super user can view all tenants');
    }
    
    return JSON.parse(localStorage.getItem('tenants') || '[]');
  },

  // Create tenant admin user
  createTenantAdmin: (tenantId: string, userData: Omit<User, 'id' | 'role' | 'tenantId' | 'createdAt'>): User => {
    const currentUser = AuthService.getCurrentUser();
    
    if (currentUser?.role !== 'super_user') {
      throw new Error('Only super user can create tenant admins');
    }
    
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    const newAdmin: User = {
      ...userData,
      id: `user-${Date.now()}`,
      role: 'tenant_admin',
      tenantId,
      createdAt: new Date().toISOString()
    };
    
    existingUsers.push(newAdmin);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    
    return newAdmin;
  },

  // Get users by tenant
  getTenantUsers: (tenantId: string): User[] => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.filter((u: User) => u.tenantId === tenantId);
  }
};
