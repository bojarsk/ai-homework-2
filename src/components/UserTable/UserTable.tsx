import React, { useEffect, useState } from "react";
import styles from "./UserTable.module.css";
import type { User } from "./types";
import UserModal from "./UserModal";
import Toast from "./Toast";

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatAddress = (address: User["address"]): string => {
    return `${address.street}, ${address.suite}, ${address.city}, ${address.zipcode}`;
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
  };

  const handleDeleteClick = (e: React.MouseEvent, userId: number) => {
    e.stopPropagation();
    setDeleteConfirmId(userId);
  };

  const confirmDelete = (userId: number) => {
    const userToDelete = users.find((user) => user.id === userId);
    setDeletingId(userId);

    setTimeout(() => {
      setUsers(users.filter((user) => user.id !== userId));
      setDeleteConfirmId(null);
      setDeletingId(null);

      // Show toast notification
      setToast({
        message: `${userToDelete?.name || "User"} deleted successfully`,
        visible: true,
      });

      setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 3000);
    }, 300); // Match this duration with the CSS animation
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (users.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIllustration}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <h3 className={styles.emptyTitle}>No Users Found</h3>
        <p className={styles.emptyMessage}>
          There are currently no users to display.
        </p>
        <button
          className={styles.refreshButton}
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Directory</h1>
      <div className={styles.tableWrapper}>
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Website</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                onClick={() => handleRowClick(user)}
                className={`${styles.clickableRow} ${
                  deletingId === user.id ? styles.deleting : ""
                }`}
                style={{
                  display: deletingId === user.id ? "table-row" : undefined,
                }}
              >
                <td>{user.name}</td>
                <td>
                  <a
                    href={`mailto:${user.email}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {user.email}
                  </a>
                </td>
                <td>{formatAddress(user.address)}</td>
                <td>
                  <a
                    href={`tel:${user.phone}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {user.phone}
                  </a>
                </td>
                <td>
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {user.website}
                  </a>
                </td>
                <td>{user.company.name}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  {deleteConfirmId === user.id ? (
                    <div className={styles.deleteConfirmation}>
                      <button
                        className={`${styles.button} ${styles.deleteButton}`}
                        onClick={() => confirmDelete(user.id)}
                      >
                        ✓ Confirm
                      </button>
                      <button
                        className={`${styles.button} ${styles.cancelButton}`}
                        onClick={cancelDelete}
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className={`${styles.button} ${styles.deleteButton}`}
                      onClick={(e) => handleDeleteClick(e, user.id)}
                    >
                      🗑️ Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && <UserModal user={selectedUser} onClose={closeModal} />}

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </div>
  );
};

export default UserTable;
