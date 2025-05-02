export type Campaign = {
  id: string;
  name: string;
  videoUrl: string;
  affiliateUrl: string;
  bonusUrl?: string; // Added bonus URL field
  createdAt: Date;
  updatedAt: Date;
};

// In-memory storage for campaigns (would be replaced with a database in production)
let campaigns: Campaign[] = [];

export async function getCampaigns(): Promise<Campaign[]> {
  return campaigns;
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  return campaigns.find(campaign => campaign.id === id) || null;
}

export async function createCampaign({ 
  name, 
  videoUrl, 
  affiliateUrl,
  bonusUrl 
}: { 
  name: string; 
  videoUrl: string; 
  affiliateUrl: string;
  bonusUrl?: string;
}): Promise<Campaign> {
  const id = Math.random().toString(36).substring(2, 9);
  const now = new Date();
  
  const campaign: Campaign = {
    id,
    name,
    videoUrl,
    affiliateUrl,
    bonusUrl,
    createdAt: now,
    updatedAt: now
  };
  
  campaigns.push(campaign);
  return campaign;
}

export async function updateCampaign(id: string, data: Partial<Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Campaign | null> {
  const index = campaigns.findIndex(campaign => campaign.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const campaign = campaigns[index];
  const updatedCampaign = {
    ...campaign,
    ...data,
    updatedAt: new Date()
  };
  
  campaigns[index] = updatedCampaign;
  return updatedCampaign;
}

export async function deleteCampaign(id: string): Promise<boolean> {
  const initialLength = campaigns.length;
  campaigns = campaigns.filter(campaign => campaign.id !== id);
  return campaigns.length < initialLength;
}
