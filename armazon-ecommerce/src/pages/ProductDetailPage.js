import { Container } from '@mui/material';
import ProductDetail from '../components/ProductDetail/ProductDetail';
import { useRouter } from 'next/router';

// PUBLIC_INTERFACE
const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Container maxWidth="lg">
      <ProductDetail productId={id} />
    </Container>
  );
};

export default ProductDetailPage;

// Enable SSR for this page
export async function getServerSideProps({ params }) {
  return {
    props: {}, // will be passed to the page component as props
  };
}
