import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Button,
  IconButton,
  CardActions,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import ComputerIcon from "@mui/icons-material/Computer";
import MemoryIcon from "@mui/icons-material/Memory";
import StorageIcon from "@mui/icons-material/Storage";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Spec = ({ icon, label }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 0.5,
      mb: 0.5,
      color: "text.secondary",
    }}
  >
    {icon}
    <Typography variant="caption">{label}</Typography>
  </Box>
);

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card
      elevation={3}
      component={RouterLink}
      sx={{
        width: "100%",
        // minHeight: 520,
        // height: 530,
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        position: "relative",
        textDecoration: "none",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid",
        borderColor: "divider",
        background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          cursor: "pointer",
        },
      }}
      to={`/products/${product._id}`}
    >
      {/* Stock Status Badge */}
      <Chip
        label={product.stock === 0 ? "Out of Stock" : "In Stock"}
        color={product.stock === 0 ? "error" : "success"}
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 2,
          fontWeight: 600,
          fontSize: "0.75rem",
        }}
      />

      {/* Product Image */}
      {product.image ? (
        <CardMedia
          component="img"
          height="200"
          image={product.image}
          alt={product.name}
          className="product-image"
          sx={{
            objectFit: "fill",
            background: "linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)",
            transition: "transform 0.4s ease",
            minHeight: 200,
            maxHeight: 200,
          }}
        />
      ) : (
        <Box
          sx={{
            // height: 200,
            // minHeight: 200,
            // maxHeight: 200,
            background: "linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "4rem",
          }}
        >
          💻
        </Box>
      )}

      <CardContent
        sx={{
          flexGrow: 1,
          p: 2.5,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            // mb: 0.5,
            color: "text.primary",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "3rem",
            lineHeight: 1.5,
          }}
        >
          {product.name}
        </Typography>

        {/* Specs */}
        <Box sx={{ mb: 1 }}>
          {product.cpu && (
            <Spec
              icon={
                <ComputerIcon sx={{ fontSize: 16, color: "primary.main" }} />
              }
              label={product.cpu}
            />
          )}
          {product.ram && (
            <Spec
              icon={<MemoryIcon sx={{ fontSize: 16, color: "primary.main" }} />}
              label={product.ram}
            />
          )}
          {product.storage && (
            <Spec
              icon={
                <StorageIcon sx={{ fontSize: 16, color: "primary.main" }} />
              }
              label={product.storage}
            />
          )}
        </Box>

        {/* Price Display */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1.5,
            // mb: 3,
            bgcolor: "rgba(25, 118, 210, 0.05)",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "rgba(25, 118, 210, 0.1)",
          }}
        >
          <Typography
            variant="h6"
            className="product-price"
            sx={{
              fontWeight: 600,
              color: product.discount_price ? "success.main" : "text.primary",
              transition: "color 0.3s ease",
            }}
          >
            EGP {(product.discount_price || product.price).toLocaleString()}
          </Typography>
          {product.discount_price && (
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                textDecoration: "line-through",
              }}
            >
              EGP {product.price.toLocaleString()}
            </Typography>
          )}
        </Box>
      </CardContent>

      <Divider />

      <CardActions
        sx={{
          p: 3,
          gap: 2,
          bgcolor: "rgba(248, 250, 252, 0.5)",
          minHeight: "80px",
          mt: "auto",
        }}
      >
        <Button
          component={RouterLink}
          to={`/products/${product._id}`}
          variant="contained"
          size="small"
          sx={{
            flex: 1,
            borderRadius: 2,
            fontWeight: 600,
            textTransform: "none",
            py: 1,
            fontSize: "1rem",
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 16px rgba(25, 118, 210, 0.3)",
            },
          }}
        >
          View Details
        </Button>
        <IconButton
          color="primary"
          onClick={() => handleAddToCart(product)}
          sx={{
            borderRadius: 3,
            border: "2px solid",
            borderColor: "primary.main",
            p: 1,
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: "primary.main",
              color: "white",
              transform: "translateY(-2px) scale(1.1)",
              boxShadow: "0 8px 16px rgba(25, 118, 210, 0.3)",
            },
          }}
        >
          <ShoppingCartIcon fontSize="medium" />
        </IconButton>
      </CardActions>
    </Card>
  );
};
export default ProductCard;
