import React from "react";
import {
  Page,
  Box,
  Button,
  Text,
  Image,
  Avatar,
  Card,
  Layout,
  Cell,
  Heading,
} from "@wix/design-system";
import * as Icons from "@wix/wix-ui-icons-common";
import {
  MarketingPageLayout,
  MarketingPageLayoutContent,
  TestimonialList,
} from "@wix/design-system";
import ImageAIProductImages from '../../../../assets/images/image_marketing-ai-product-images.png';
import MarketingCard from './MarketingCard';
import appListData from './appListData.json';

interface AppData {
  id: string;
  title: string;
  description: string;
  pricing?: string;
  image: string;
  icon: string;
  url: string;
  category: string;
}

const MarketingSection: React.FC = () => {
  const handleExploreMore = () => {
    window.open('https://www.wix.com/app-market/898091f9-dc3b-4ee6-95c7-ff0a7864ecb7', '_blank', 'noopener');
  };

  const handleAppClick = (app: AppData) => {
    window.open(app.url, '_blank', 'noopener');
  };

  const apps = appListData.apps as AppData[];

  return (
    <Box direction="vertical" gap="24px">
      {/* Main AI Product Images Marketing Card */}
      <Card>
        <MarketingPageLayout
          content={
            <Box height="360px" verticalAlign="middle">
              <MarketingPageLayoutContent
                title={<Box direction="vertical" gap={3}>
                  <Image src={"https://static.wixstatic.com/media/fa5794_2e3a1f8a2ca54a22a9eaea20625d0980~mv2.png"} width={60} height={60} style={{
                    marginTop: '-12px'
                  }} />
                  <Heading>Create Stunning AI Product Images</Heading>
                </Box>}
                subtitle="Transform any photo into a professional product shot"
                content={
                  <Text>
                    <ul>
                      <li>Instantly enhance low-quality photos</li>
                      <li>Replace messy backgrounds with clean, AI-generated ones</li>
                      <li>Keep a consistent look across your entire store</li>
                    </ul>
                  </Text>
                }
                actions={
                  <Box gap={1} direction="vertical" align="center">
                    <Button size="medium" suffixIcon={<Icons.ExternalLink />} onClick={handleExploreMore}>Add to Site</Button>
                    <Text size="tiny" secondary>Free plan available</Text>
                    {/* <Button priority="secondary" prefixIcon={<Icons.PlayFilled />}>
                      See AI Product Images in Action
                    </Button> */}
                  </Box>
                }
              />
            </Box>
          }
          image={<Box style={{ transform: 'translateY(49px)' }}><Image src={ImageAIProductImages} transparent borderRadius={0} /></Box>}
        />
      </Card>

      {/* Recommended Apps Section */}

      <Layout>
        {apps.slice(0, 6).map((app) => (
          <Cell key={app.id} span={4}>
            <MarketingCard
              image={app.image}
              icon={app.icon}
              title={app.title}
              description={app.description}
              pricing={app.pricing}
              onClick={() => handleAppClick(app)}
              imageAlt={`${app.title} promotional image`}
              iconAlt={`${app.title} icon`}
            />
          </Cell>
        ))}
      </Layout>

    </Box>
  );
};

export default MarketingSection;
