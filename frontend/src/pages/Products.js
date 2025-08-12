import { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Grid,
  Box,
  Container,
  Breadcrumbs,
  Chip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { getCategories, getProducts } from "../api";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../CartContext";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [addedProductName, setAddedProductName] = useState("");

  // Get URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get("search") || "";
    const categoryParam = urlParams.get("category") || "";

    setSearchQuery(searchParam);
    setSelectedCategory(categoryParam);
  }, [location.search]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        setError("Failed to load products. Please try again.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Enhanced filtering logic
  const getFilteredProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category_id && product.category_id._id === selectedCategory
      );
    }

    // Price range filter
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      filtered = filtered.filter((product) => {
        const price = product.discount_price || product.price;
        if (max) {
          return price >= min && price <= max;
        } else {
          return price >= min;
        }
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priceAsc":
          const priceA = a.discount_price || a.price;
          const priceB = b.discount_price || b.price;
          return priceA - priceB;
        case "priceDesc":
          const priceDescA = a.discount_price || a.price;
          const priceDescB = b.discount_price || b.price;
          return priceDescB - priceDescA;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    } else {
      params.delete("search");
    }
    navigate(`/products?${params.toString()}`);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProductName(product.name);
    setSnackbarOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setPriceRange("");
    setSortBy("name");
    navigate("/products");
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "";
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 30, textAlign: "center" }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading products...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Header Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #13375bff 0%, #1565c0 100%)",
          color: "white",
          py: 6,
          mb: 4,
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h2"
            sx={{ fontWeight: 700, mb: 2, textAlign: "center", color: "white" }}
          >
            {selectedCategory
              ? `${getCategoryName(selectedCategory)} Laptops`
              : "Premium Laptops Collection"}
          </Typography>
          <Typography
            variant="h6"
            sx={{ textAlign: "center", opacity: 0.9, mb: 3, color: "white" }}
          >
            Discover cutting-edge technology with unbeatable performance and
            quality
          </Typography>

          {/* Breadcrumbs */}
          <Breadcrumbs
            sx={{
              justifyContent: "center",
              display: "flex",
              "& .MuiBreadcrumbs-ol": { justifyContent: "center" },
            }}
            separator={
              <Typography sx={{ color: "rgba(255,255,255,0.7)" }}>›</Typography>
            }
          >
            {selectedCategory && (
              <Typography sx={{ color: "white", fontWeight: 500 }}>
                {getCategoryName(selectedCategory)}
              </Typography>
            )}
          </Breadcrumbs>
        </Container>
      </Box>

      <Container>
        {/* Search and Filters Section */}
        <Box sx={{ mb: 4 }}>
          {/* Search Bar */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
            <Paper
              component="form"
              onSubmit={handleSearchSubmit}
              elevation={3}
              sx={{
                p: 1,
                display: "flex",
                alignItems: "center",
                borderRadius: 2,
                maxWidth: 700,
                width: "100%",
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  elevation: 4,
                  transform: "translateY(-2px)",
                  transition: "all 0.3s ease",
                },
              }}
            >
              <TextField
                fullWidth
                placeholder="Search laptops by name, brand, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "transparent",
                    "& fieldset": { border: "none" },
                    fontSize: "1.1rem",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{ color: "primary.main", fontSize: 28 }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setSearchQuery("")}
                        size="small"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="small"
                sx={{
                  ml: 2,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                Search
              </Button>
            </Paper>
          </Box>

          {/* Active Filters Display */}
          {(searchQuery || selectedCategory) && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mb: 3,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Active filters:
              </Typography>
              {searchQuery && (
                <Chip
                  label={`Search: "${searchQuery}"`}
                  onDelete={() => setSearchQuery("")}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              )}
              {selectedCategory && (
                <Chip
                  label={`Category: ${getCategoryName(selectedCategory)}`}
                  onDelete={() => setSelectedCategory("")}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              )}
              <Button
                size="small"
                onClick={clearFilters}
                startIcon={<ClearIcon />}
                sx={{ ml: 1 }}
              >
                Clear All
              </Button>
            </Box>
          )}
        </Box>

        {/* Filters and Sort */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <FilterListIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters & Sort
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowFilters(!showFilters)}
              sx={{ ml: "auto" }}
            >
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </Box>

          {showFilters && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
              <FormControl sx={{ minWidth: 180 }} size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 180 }} size="small">
                <InputLabel>Price Range</InputLabel>
                <Select
                  value={priceRange}
                  label="Price Range"
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <MenuItem value="">All Prices</MenuItem>
                  <MenuItem value="0-10000">Under EGP 10,000</MenuItem>
                  <MenuItem value="10000-20000">EGP 10,000 - 20,000</MenuItem>
                  <MenuItem value="20000-50000">EGP 20,000 - 50,000</MenuItem>
                  <MenuItem value="50000">Over EGP 50,000</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Showing {filteredProducts.length} of {products.length} products
            </Typography>

            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name (A-Z)</MenuItem>
                <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* No Products Found */}
        {filteredProducts.length === 0 && (
          <Paper
            elevation={2}
            sx={{ p: 6, textAlign: "center", borderRadius: 2, mb: 4 }}
          >
            <Typography variant="h5" sx={{ mb: 2, color: "text.secondary" }}>
              No products found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search criteria or browse all products.
            </Typography>
            <Button variant="contained" onClick={clearFilters}>
              Show All Products
            </Button>
          </Paper>
        )}

        {/* Product Grid */}
        <Grid container spacing={3} justifyContent={"center"}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <ProductCard
                product={product}
                handleAddToCart={handleAddToCart}
              />
            </Grid>
          ))}
        </Grid>
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
          "{addedProductName}" added to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Products;
