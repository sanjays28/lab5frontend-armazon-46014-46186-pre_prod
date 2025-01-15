import { useRouter } from 'next/router';
import ProductList from '../components/ProductList/ProductList';
import ProductListSkeleton from '../components/ProductList/ProductListSkeleton';

// PUBLIC_INTERFACE
export default function Home() {
  const router = useRouter();
  const isLoading = router.isFallback;

  if (isLoading) {
    return <ProductListSkeleton />;
  }

  return <ProductList />;
}

// Enable SSR for this page
export async function getStaticProps() {
  return {
    props: {},
    revalidate: 60, // Revalidate every 60 seconds
  };
}
