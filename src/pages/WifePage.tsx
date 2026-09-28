import DetailPageLayout from '@/components/DetailPageLayout';
import WifeSection from '@/components/WifeSection';
import KimmySocialMedia from '@/components/KimmySocialMedia';

const WifePage = () => (
  <DetailPageLayout title="My Wife">
    <WifeSection />
    <KimmySocialMedia />
  </DetailPageLayout>
);

export default WifePage;