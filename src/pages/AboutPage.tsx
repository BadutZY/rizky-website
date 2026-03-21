import DetailPageLayout from '@/components/DetailPageLayout';
import About from '@/components/About';
import PlaylistCards from '@/components/PlaylistCards';

const AboutPage = () => {
  return (
    <DetailPageLayout title="About Me">
      <About />
      <PlaylistCards />
    </DetailPageLayout>
  );
};

export default AboutPage;
