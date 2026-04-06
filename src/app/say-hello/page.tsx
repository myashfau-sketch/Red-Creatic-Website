import { Metadata } from 'next';
import Header from '../../components/common/Header';
import SayHelloInteractive from './components/SayHelloInteractive';
import Footer from '../homepage/components/Footer';
import { isSitePageEnabled, type SitePageSearchParams } from '../../lib/site-page-settings';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Say Hello - Red Creatic Maldives',
  description:
    'Contact Red Creatic for professional printing and signage solutions in Maldives. Get in touch via phone, email, WhatsApp, or visit our office in Malé. Fast response guaranteed.',
};

export default async function SayHelloPage({
  searchParams,
}: {
  searchParams?: SitePageSearchParams;
}) {
  if (!(await isSitePageEnabled('say-hello', searchParams))) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="pt-16">
        <SayHelloInteractive />
      </main>
      <Footer />
    </>
  );
}
