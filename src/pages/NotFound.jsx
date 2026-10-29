import Container from '@/components/common/Container';
import Button from '@/components/common/Button';

export default function NotFound() {
  return (
    <Container className="py-28 text-center">
      <p className="font-display text-7xl font-bold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-slate-600">The page you are looking for does not exist.</p>
      <Button to="/" className="mt-8">
        Back to home
      </Button>
    </Container>
  );
}
