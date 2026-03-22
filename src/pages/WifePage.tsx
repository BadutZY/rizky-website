import DetailPageLayout from '@/components/DetailPageLayout';
import WifeSection from '@/components/WifeSection';
import KimmyLiveStatus from '@/components/KimmyLiveStatus';
import LiveReplay from '@/components/LiveReplay';

const WifePage = () => (
  <DetailPageLayout title="My Wife">
    <WifeSection />
    <KimmyLiveStatus />
    <LiveReplay />
  </DetailPageLayout>
);

export default WifePage;
