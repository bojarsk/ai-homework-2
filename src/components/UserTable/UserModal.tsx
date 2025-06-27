import React, { useState, useEffect } from "react";
import styles from "./UserTable.module.css";
import type { User } from "./types";

interface UserModalProps {
  user: User;
  onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  const getGoogleMapsLink = (geo: { lat: string; lng: string }) => {
    return `https://www.google.com/maps?q=${geo.lat},${geo.lng}`;
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200); // Match this with the animation duration
  };

  return (
    <div
      className={`${styles.modalOverlay} ${isClosing ? styles.closing : ""}`}
      onClick={handleClose}
    >
      <div
        className={`${styles.modalContent} ${isClosing ? styles.closing : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={handleClose}>
          &times;
        </button>

        <h2>{user.name}</h2>
        <p className={styles.username}>@{user.username}</p>

        <div className={styles.modalGrid}>
          <div className={styles.modalSection}>
            <h3>Contact Information</h3>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Email:</span>
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Phone:</span>
              <a href={`tel:${user.phone}`}>{user.phone}</a>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Website:</span>
              <a
                href={`https://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.website}
              </a>
            </div>
          </div>

          <div className={styles.modalSection}>
            <h3>Address</h3>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Street:</span>
              <span>{user.address.street}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Suite:</span>
              <span>{user.address.suite}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>City:</span>
              <span>
                {user.address.city}, {user.address.zipcode}
              </span>
            </div>
            <div className={styles.detailItem}>
              <a
                href={getGoogleMapsLink(user.address.geo)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapLink}
              >
                <span>📍</span> View on Map
              </a>
            </div>
          </div>

          <div className={styles.modalSection}>
            <h3>Company</h3>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Name:</span>
              <span>{user.company.name}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Catchphrase:</span>
              <span>"{user.company.catchPhrase}"</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Business:</span>
              <span className={styles.bs}>{user.company.bs}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
