import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ProfileSettings.module.css";

const ProfileSettings = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [name, setName] = useState(storedUser?.name || "");
  const [password, setPassword] = useState("");
  const [preview, setPreview] = useState(
    storedUser?.profilePic ? `http://localhost:5000${storedUser.profilePic}` : ""
  );
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleRemove = async () => {
    setFile(null);
    setPreview("");

     try {
    const res = await axios.put("http://localhost:5000/api/auth/remove-profile-pic", {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    alert("Profile picture removed");
    localStorage.setItem("user", JSON.stringify(res.data.user));
    window.location.reload();
  } catch (err) {
    alert("Failed to remove profile picture");
    console.error(err);
  }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    if (password) formData.append("password", password);
    if (file) formData.append("profilePic", file);

    try {
      const res = await axios.put("http://localhost:5000/api/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Profile updated successfully.");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.reload(); // refresh sidebar/profile info
    } catch (err) {
      alert("Update failed");
      console.error(err);
    }
  };

  return (
    <div className={styles.profileSettings}>
      <h2 className={styles.sectionTitle}>Profile Settings</h2>

      <div className={styles.profilePicSection}>
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className={styles.profileImagePreview}
          />
        )}
        <input
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleFileChange}
        />
        {preview && (
          <div className={styles.buttonGroup}>
            <button type="button" className={styles.removeBtn} onClick={handleRemove}>
              Remove
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleUpdate}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className={styles.saveButton}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
