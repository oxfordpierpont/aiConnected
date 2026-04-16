import { Octokit } from 'octokit';

export interface Sponsor extends SponsorEntity {
  tier: Tier;
}

interface SponsorEntity {
  login: string;
  avatarUrl: string;
  websiteUrl: string;
  name: string;
  __typename: string;
}

interface Tier {
  monthlyPriceInDollars: number;
  name?: string | null;
}

export const revalidate = 60 * 30;

export async function getSponsors(owner: string): Promise<Sponsor[]> {
  if (!process.env.GITHUB_TOKEN) {
    console.warn('GITHUB_TOKEN environment variable is required for fetching sponsors.');
    return [];
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  try {
    const response = await octokit.graphql<{
      user: {
        sponsorshipsAsMaintainer: {
          nodes: Array<{
            sponsorEntity: SponsorEntity | null;
            tier: Tier | null;
          }>;
        };
      };
    }>(`
      query {
        user(login: ${JSON.stringify(owner)}) {
          sponsorshipsAsMaintainer(first: 100) {
            nodes {
              sponsorEntity {
                __typename
                ... on User {
                    login
                    avatarUrl
                    name
                    websiteUrl
                }
                ... on Organization {
                    login
                    avatarUrl
                    websiteUrl
                    name
                }
              }
              tier {
                monthlyPriceInDollars
                name
              }
            }
          }
        }
      }
    `);

    const sponsors = response.user.sponsorshipsAsMaintainer.nodes
      .map((node) => {
        if (!node.sponsorEntity || node.tier?.monthlyPriceInDollars == null) return null;

        return {
          ...node.sponsorEntity,
          name: node.sponsorEntity.name || node.sponsorEntity.login,
          tier: node.tier,
        };
      })
      .filter((sponsor): sponsor is Sponsor => sponsor !== null);

    // Sort sponsors by tier price in descending order
    return sponsors.sort((a, b) => b.tier.monthlyPriceInDollars - a.tier.monthlyPriceInDollars);
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return [];
  }
}
