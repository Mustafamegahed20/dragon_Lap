import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { Box, Container, Typography, IconButton } from "@mui/material";

const ContactBar = () => {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #13375bff 0%, #1565c0 100%)",
        py: 0.75,
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "0.875rem",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            variant="body2"
            sx={{
              display: { xs: "none", sm: "block" },
              color: "white",
            }}
          >
            📞 24/7 Support: 01060461071
          </Typography>
          <Typography
            variant="body2"
            sx={{
              display: { xs: "none", md: "block" },
              color: "white",
            }}
          >
            🚚 Free shipping on orders over 10000 EGP
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            sx={{
              color: "white",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            <FacebookIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color: "white",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
          >
            <InstagramIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color: "white",
              "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            }}
            onClick={() =>
              window.open(
                "https://wa.me/201060461071?text=Hello%20Dragon%20Lap!%20I%20would%20like%20to%20inquire%20about%20your%20laptops.",
                "_blank"
              )
            }
          >
            <WhatsAppIcon fontSize="small" />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactBar;
