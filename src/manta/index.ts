export type species = 'Alfredi' | 'Birostris';
export type sex = 'U' | 'M' | 'F'; // Unknown, male or female
export type pigmentation = 'L' | 'M' | 'N';
export type unsureBoolean = 'U' | 'Y' | 'N'; // Unknown, yes or no
export type sureBoolean = 'Y' | 'N'; // Yes or no

export type Manta = {
  [key: string]: string;
};
