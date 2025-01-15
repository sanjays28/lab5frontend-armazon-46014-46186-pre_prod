import { Container } from '@mui/material';
import { useRouter } from 'next/router';
import ProductDetail from '../../components/ProductDetail/ProductDetail';
import ProductDetailSkeleton from '../../components/ProductDetail/ProductDetailSkeleton';

// PUBLIC_INTERFACE
const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const isLoading = router.isFallback;

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <ProductDetailSkeleton />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <ProductDetail productId={id} />
    </Container>
  );
};

export default ProductDetailPage;

// Enable static generation with fallback
export async function getStaticPaths() {
  return {
    paths: [], // Don't pre-render any paths
    fallback: true, // Enable fallback for paths not generated at build time
  };
}

// Get static props for each product page
export async function getStaticProps({ params }) {
  return {
    props: {
      id: params.id,
    },
    revalidate: 60, // Revalidate every 60 seconds
  };
}
