import Container from './Container';

export default function PageHeader({ title, subtitle }) {
  return (
    <section className="bg-gradient-to-br from-brand-800 to-brand-600 py-16 text-white">
      <Container>
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-brand-100">{subtitle}</p>}
      </Container>
    </section>
  );
}
