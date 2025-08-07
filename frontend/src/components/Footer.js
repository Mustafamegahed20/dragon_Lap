import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import logo from "../assets/logo.jpg";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
        mt: "auto",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          {/* Company Info */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <img
                src={logo}
                alt="Dragon Lap"
                style={{ height: 40, marginRight: 12, borderRadius: 8 }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: "primary.main" }}
              >
                Dragon Lap
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, maxWidth: 300 }}
            >
              Your trusted partner for premium laptops and computing solutions.
              Quality, performance, and customer satisfaction guaranteed.
            </Typography>

            {/* Social Media */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                color="primary"
                sx={{ "&:hover": { bgcolor: "primary.main", color: "white" } }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                size="small"
                color="primary"
                sx={{ "&:hover": { bgcolor: "primary.main", color: "white" } }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                size="small"
                color="primary"
                sx={{ "&:hover": { bgcolor: "primary.main", color: "white" } }}
              >
                <YouTubeIcon />
              </IconButton>
              <IconButton
                size="small"
                color="primary"
                sx={{ "&:hover": { bgcolor: "primary.main", color: "white" } }}
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                size="small"
                color="primary"
                sx={{ "&:hover": { bgcolor: "primary.main", color: "white" } }}
                onClick={() =>
                  window.open(
                    "https://wa.me/201060461071?text=Hello%20Dragon%20Lap!%20I%20would%20like%20to%20inquire%20about%20your%20laptops.",
                    "_blank"
                  )
                }
              >
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Quick Links */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[
                { label: "Home", path: "/" },
                { label: "Products", path: "/products" },
                { label: "About Us", path: "/about" },
                { label: "Contact", path: "/contact" },
                { label: "FAQ", path: "/faq" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    textDecoration: "none",
                    color: "#4a5568",
                    fontSize: "0.875rem",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#1976d2")}
                  onMouseLeave={(e) => (e.target.style.color = "#4a5568")}
                >
                  {link.label}
                </Link>
              ))}
            </Box>
          </Box>

          {/* Customer Service */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
            >
              Customer Service
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                📞 Phone: 01060461071
              </Typography>
              <Typography variant="body2" color="text.secondary">
                📧 Email: info@dragonlap.com
              </Typography>
              <Typography variant="body2" color="text.secondary">
                🕒 Hours: Mon-Fri 9AM-6PM
              </Typography>
              <Typography variant="body2" color="text.secondary">
                🚚 Free shipping on orders over 10000 EGP
              </Typography>
            </Box>
          </Box>

          {/* Newsletter */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
            >
              Stay Updated
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Subscribe to get updates on new products and exclusive offers.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <InputBase
                placeholder="Enter email"
                sx={{
                  flex: 1,
                  bgcolor: "background.default",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  px: 1.5,
                  py: 0.5,
                  fontSize: "0.875rem",
                }}
              />
              <Button variant="contained" size="small" sx={{ px: 2 }}>
                Subscribe
              </Button>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Copyright */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 Dragon Lap. All rights reserved. | Privacy Policy | Terms of
            Service
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
