"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MuiAlert from '@mui/material/Alert';
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

export default function CreateUser() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    isBussines: false,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [open, setOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === "radio") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "true",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/api/ApplicationUser/create", formData);

      if (response.data.success) {
        setSuccess("Përdoruesi u shtua me sukses!");
        setOpen(true);

        setFormData({
          username: "",
          email: "",
          password: "",
          isBussines: false,
        });

        setTimeout(() => {
          router.push("/page/dashboard/users/user-lists");
        }, 2000);
      } else {
        setError(response.data.message || "Ndodhi një gabim.");
        setOpen(true);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Gabim gjatë lidhjes me serverin.";
      setError(msg);
      setOpen(true);
    }
  };

  return (
    <Box
      component={Paper}
      elevation={3}
      sx={{ maxWidth: 500, mx: "auto", p: 4, mt: 5 }}
    >
      <Typography variant="h5" gutterBottom>
        👤 Krijo Përdorues të Ri
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Emri i përdoruesit"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Fjalëkalimi"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <FormControl component="fieldset" margin="normal" fullWidth>
          <FormLabel component="legend">Roli</FormLabel>
          <RadioGroup
            name="isBussines"
            value={formData.isBussines.toString()}
            onChange={handleChange}
          >
            <FormControlLabel
              value="false"
              control={<Radio />}
              label="Përdorues i zakonshëm"
            />
            <FormControlLabel
              value="true"
              control={<Radio />}
              label="Biznes"
            />
          </RadioGroup>
        </FormControl>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          ➕ Krijo Përdoruesin
        </Button>
      </form>

      {(success || error) && (
  <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
    <MuiAlert
      severity={success ? "success" : "error"}
      onClose={() => setOpen(false)}
      sx={{ width: '100%' }}
    >
      {success ? `✅ ${success}` : `❌ ${error}`}
    </MuiAlert>
  </Snackbar>
)}


    </Box>
  );
}
