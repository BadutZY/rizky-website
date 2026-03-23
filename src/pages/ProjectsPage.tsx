import DetailPageLayout from '@/components/DetailPageLayout';
import Projects from '@/components/Projects';
import LivePreview from '@/components/LivePreview';

const ProjectsPage = () => (
  <DetailPageLayout title="My Projects">
    <Projects />
    <LivePreview />
  </DetailPageLayout>
);

export default ProjectsPage;