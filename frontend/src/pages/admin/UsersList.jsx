import React, { useState } from 'react';
import { initialUsers } from '../../api/mockData';

export function UsersList() {
  const [users] = useState(initialUsers);

  return (
    <div className="admin-page-content">
      <div className="content-page-header">
        <div>
          <h1 className="content-page-title">Users & Permissions</h1>
          <p className="content-page-subtitle">Manage internal staff roles and customer portal accounts</p>
        </div>
      </div>

      <div className="content-card">
        <div className="table-responsive">
          <table className="ref-data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="flex-center gap-10">
                      <div className="avatar-circle-sm">{u.name.charAt(0)}</div>
                      <span className="font-semibold">{u.name}</span>
                    </div>
                  </td>
                  <td className="text-secondary">{u.email}</td>
                  <td>
                    <span
                      className={`role-pill ${
                        u.role === 'Admin'
                          ? 'role-admin'
                          : u.role === 'Staff'
                          ? 'role-staff'
                          : 'role-customer'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge-chip badge-green">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

