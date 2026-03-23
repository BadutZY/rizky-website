import DetailPageLayout from '@/components/DetailPageLayout';
import Skills from '@/components/Skills';
import TechStackGrid from '@/components/TechStackGrid';
import GitHubStats from '@/components/GithubStats';

const SkillsPage = () => {
  return (
    <DetailPageLayout title="My Skills">
      <Skills />
      <TechStackGrid />
      <GitHubStats />
    </DetailPageLayout>
  );
};

export default SkillsPage;