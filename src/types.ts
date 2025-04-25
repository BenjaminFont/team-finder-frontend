// Types based on backend models
export interface Skill {
  skill: string;
  rating: number;
}

export interface Player {
  id?: number;
  name: string;
  rating: number;
  skills: Skill[];
  handynummer: string;
  imgSrc?: string;
  groupId: number;
  userId: number;
}
