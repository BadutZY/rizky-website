import DetailPageLayout from '@/components/DetailPageLayout';
import WifeSection from '@/components/WifeSection';
import KimmyLiveStatus from '@/components/KimmyLiveStatus';
import LiveReplay from '@/components/LiveReplay';
import KimmySocialMedia from '@/components/KimmySocialMedia';

const WifePage = () => (
  <DetailPageLayout title="My Wife">
    <WifeSection />
    <KimmyLiveStatus />
    <LiveReplay />
    <KimmySocialMedia />
  </DetailPageLayout>
);

export default WifePage;