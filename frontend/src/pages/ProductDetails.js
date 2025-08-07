import {
  CardMedia,
  Button,
  Typography,
  Box,
  Container,
  Paper,
  Snackbar,
  Alert,
  Chip,
  Divider,
  Grid,
  Stack,
  Avatar,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "../api";
import { useCart } from "../CartContext";
import {
  Computer as ComputerIcon,
  Memory as MemoryIcon,
  Storage as StorageIcon,
  Monitor as MonitorIcon,
  BatteryChargingFull as BatteryIcon,
  LocalOffer as PriceIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const prod = await getProduct(id);
      setProduct(prod);
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setSnackbarOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  // Specification items data
  const specificationItems = [
    {
      key: "cpu",
      label: "Processor",
      icon: <ComputerIcon fontSize="small" />,
      color: "primary.main",
    },
    {
      key: "ram",
      label: "Memory",
      icon: <MemoryIcon fontSize="small" />,
      color: "success.main",
    },
    {
      key: "storage",
      label: "Storage",
      icon: <StorageIcon fontSize="small" />,
      color: "warning.main",
    },
    {
      key: "screen_size",
      label: "Display",
      icon: <MonitorIcon fontSize="small" />,
      color: "secondary.main",
    },
    {
      key: "battery",
      label: "Battery",
      icon: <BatteryIcon fontSize="small" />,
      color: "error.main",
    },
  ].filter((item) => product[item.key]);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="lg">
        {/* Main Product Card */}
        <Paper
          elevation={0}
          sx={{
            overflow: "hidden",
            bgcolor: "background.paper",
            boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
            mb: 4,
          }}
        >
          <Grid container>
            <Grid item xs={12} md={8}>
              <Box sx={{ height: "100%" }}>
                <Box
                  sx={{
                    overflow: "hidden",
                    bgcolor: "grey.50",
                    height: "100%",
                    width: 480,
                    minHeight: 400,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  {product.image ? (
                    <CardMedia
                      component="img"
                      image={product.image}
                      alt={product.name}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "fill",
                        transition: "transform 0.3s",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                  ) : (
                    <ComputerIcon
                      sx={{
                        fontSize: 80,
                        color: "grey.400",
                      }}
                    />
                  )}
                  {/* Stock Badge */}
                  <Chip
                    label={product.stock === 0 ? "Out of Stock" : "In Stock"}
                    color={product.stock === 0 ? "error" : "success"}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      fontWeight: 700,
                      px: 1.5,
                    }}
                  />
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  p: { xs: 3, md: 4 },
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                {/* Product Name */}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    mb: 1,
                    fontSize: { xs: "1.5rem", md: "2rem" },
                    color: "text.primary",
                  }}
                >
                  {product.name}
                </Typography>

                {/* Price */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 3,
                  }}
                >
                  <PriceIcon color="primary" />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                    }}
                  >
                    {product.price.toFixed(2)} EGP
                  </Typography>
                </Box>

                {/* Specifications */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: "text.primary",
                    }}
                  >
                    Specifications
                  </Typography>

                  <Stack spacing={1}>
                    {specificationItems.map((item) => (
                      <Stack
                        key={item.key}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                      >
                        <Avatar
                          sx={{ bgcolor: item.color, width: 40, height: 40 }}
                        >
                          {item.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {item.label}
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {product[item.key]}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Action Buttons */}
                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: "1rem",
                      textTransform: "none",
                      boxShadow: "none",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    + Add to Cart - EGP {product.price.toFixed(2)}
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Description Section */}
        {product.description && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: 1,
              p: 4,
              bgcolor: "background.paper",
              boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} mb={3}>
              <DescriptionIcon color="primary" />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                Product Description
              </Typography>
            </Stack>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                color: "text.secondary",
                whiteSpace: "pre-line",
              }}
            >
              {product.description}
            </Typography>
          </Paper>
        )}
      </Container>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          "{product.name}" added to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductDetails;
