import DetailPageLayout from '@/components/DetailPageLayout';
import WifeSection from '@/components/WifeSection';
import KimmyLiveStatus from '@/components/KimmyLiveStatus';

const WifePage = () => (
  <DetailPageLayout title="My Wife">
    <WifeSection />
    <KimmyLiveStatus />
  </DetailPageLayout>
);

export default WifePage;
