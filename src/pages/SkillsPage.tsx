import DetailPageLayout from '@/components/DetailPageLayout';
import Skills from '@/components/Skills';
import TechStackGrid from '@/components/TechStackGrid';

const SkillsPage = () => {
  return (
    <DetailPageLayout title="My Skills">
      <Skills />
      <TechStackGrid />
    </DetailPageLayout>
  );
};

export default SkillsPage;
